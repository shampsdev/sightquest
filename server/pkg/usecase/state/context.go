package state

import (
	"context"
	"log/slog"

	"github.com/google/uuid"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

type Event interface {
	Event() string
}

type Conn interface {
	Emit(event string, data any)
	Join(roomID string)
	Close() error
}

type Server[S any] interface {
	ForEach(roomID string, f func(c *Context[S]))
}

type HandlerFunc[S any, E any] func(c *Context[S], event E) error

// Context

type Context[S any] struct {
	Ctx context.Context
	Log *slog.Logger
	S   S

	roomID string
	conn   Conn
	connID string
	s      Server[S]
}

func NewContext[S any](ctx context.Context, s Server[S], conn Conn) *Context[S] {
	return &Context[S]{
		Ctx:    ctx,
		s:      s,
		conn:   conn,
		connID: uuid.New().String(),
		Log:    slog.Default(),
	}
}

func (c *Context[S]) JoinRoom(roomID string) {
	c.roomID = roomID
	c.conn.Join(roomID)
	c.Log = c.Log.With("room", roomID)
	c.Log.Debug("Joined room")
}

func (c *Context[S]) Emit(e Event) {
	c.conn.Emit(e.Event(), e)

	c.Log.With("emitted_event", e.Event()).Debug("Event emitted")
}

func (c *Context[S]) Broadcast(e Event) {
	c.s.ForEach(c.roomID, func(c *Context[S]) {
		c.Emit(e)
	})
}

func (c *Context[S]) BroadcastToOthers(e Event) {
	c.s.ForEach(c.roomID, func(cc *Context[S]) {
		if c.connID != cc.connID {
			cc.Emit(e)
		}
	})
}

func (c *Context[S]) ForEach(f func(c *Context[S])) {
	c.s.ForEach(c.roomID, f)
}

func (c *Context[S]) Close() error {
	return c.conn.Close()
}

func (c *Context[S]) Error(err error) {
	c.Log.Error("Error", slogx.Err(err))
	c.conn.Emit("error", err.Error())
	if err = c.conn.Close(); err != nil {
		c.Log.Error("Error closing connection", slogx.Err(err))
	}
}
