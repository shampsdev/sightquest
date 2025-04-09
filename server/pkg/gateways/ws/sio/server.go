package sio

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"
	"github.com/googollee/go-socket.io/engineio/transport/polling"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"
	"github.com/shampsdev/sightquest/server/pkg/usecase/state"

	"github.com/googollee/go-socket.io/engineio"
	"github.com/googollee/go-socket.io/engineio/transport"
	"github.com/googollee/go-socket.io/engineio/transport/websocket"

	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

type Server[S any] struct {
	SIO     *socketio.Server
	metrics ServerMetrics
	handler state.Handler[S, state.AnyEvent]
}

var events = []string{
	event.AuthEvent,
	event.GameEvent,
	event.JoinGameEvent,
	event.LocationUpdateEvent,
}

func NewServer[S any](
	r *gin.Engine,
	handler state.Handler[S, state.AnyEvent],
) *Server[S] {
	s := &Server[S]{
		SIO:     newSocketIOServer(),
		metrics: NewServerMetrics(),
		handler: handler,
	}
	s.setup()
	r.GET("/socket.io/*any", gin.WrapH(s.SIO))
	r.POST("/socket.io/*any", gin.WrapH(s.SIO))
	return s
}

func newSocketIOServer() *socketio.Server {
	wt := websocket.Default
	// TODO legal CheckOrigin
	wt.CheckOrigin = func(_ *http.Request) bool { return true }
	pt := polling.Default
	pt.CheckOrigin = func(_ *http.Request) bool { return true }

	server := socketio.NewServer(&engineio.Options{
		Transports: []transport.Transport{
			wt, pt,
		},
	})

	return server
}

func (s *Server[S]) setup() {
	s.SIO.OnConnect("/", func(conn socketio.Conn) error {
		defer s.metrics.ActiveConnections.Inc()
		sioConn := s.wrapSocketIOConn(conn)
		c := state.NewContext(context.TODO(), s, sioConn)
		conn.SetContext(c)
		err := s.handler.OnConnect(c)
		if err != nil {
			c.Error(fmt.Errorf("error while adding user to room: %w", err))
			return err
		}
		return nil
	})

	s.SIO.OnError("/", func(conn socketio.Conn, err error) {
		c, ok := conn.Context().(*state.Context[S])
		if ok {
			c.Error(err)
		} else {
			slog.Error("Error in sio, context not found", slogx.Err(err))
			conn.Emit("error", err.Error())
		}
	})

	s.SIO.OnDisconnect("/", func(conn socketio.Conn, msg string) {
		defer func() {
			s.metrics.ActiveConnections.Dec()
		}()
		c, ok := conn.Context().(*state.Context[S])
		if !ok {
			slog.Info("Diconnected with msg", "msg", msg)
			return
		}

		err := s.handler.OnDisconnect(c)
		if err != nil {
			c.Error(fmt.Errorf("error while leaving: %w", err))
		}
	})

	for _, event := range events {
		s.SIO.OnEvent("/", event, func(conn socketio.Conn, data any) {
			c, ok := conn.Context().(*state.Context[S])
			if !ok {
				slog.Error("Error in sio, context not found")
				return
			}
			err := s.handler.Handle(c, state.NewAnyEvent(event, data))
			if err != nil {
				c.Error(fmt.Errorf("error while handling event: %w", err))
			}
		})
	}
}

func (s *Server[S]) ForEach(roomID string, f func(c *state.Context[S])) {
	s.SIO.ForEach("/", roomID, func(conn socketio.Conn) {
		if c, ok := conn.Context().(*state.Context[S]); ok {
			f(c)
		}
	})
}

type socketIOConn[S any] struct {
	conn socketio.Conn
	s    *Server[S]
}

func (s *Server[S]) wrapSocketIOConn(conn socketio.Conn) *socketIOConn[S] {
	return &socketIOConn[S]{conn: conn, s: s}
}

func (s *socketIOConn[S]) Emit(event string, data any) {
	s.s.metrics.Responses.WithLabelValues(event).Inc()
	s.conn.Emit(event, data)
}

func (s *socketIOConn[S]) Close() error {
	return s.conn.Close()
}

func (s *socketIOConn[S]) Join(roomID string) {
	s.conn.Join(roomID)
}
