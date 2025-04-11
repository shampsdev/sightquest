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
	Leave(roomID string)
	Close() error
}

type Server[S any] interface {
	ForEach(roomID string, f func(c *Context[S]))
}

type HandlerFunc[S any, E any] func(c *Context[S], event E) error

// Context

type Context[S any] struct {
	Ctx context.Context
	S   S

	roomID *string
	conn   Conn
	connID string
	s      Server[S]

	emitMW  func(*Context[S], Event)
	errorMW func(*Context[S], error)
}

func NewContext[S any](ctx context.Context, s Server[S], conn Conn) *Context[S] {
	return &Context[S]{
		Ctx:    ctx,
		s:      s,
		roomID: new(string),
		conn:   conn,
		connID: uuid.New().String(),
	}
}

func (c *Context[S]) JoinRoom(roomID string) {
	*c.roomID = roomID
	c.conn.Join(roomID)
}

func (c *Context[S]) LeaveRoom(roomID string) {
	c.conn.Leave(roomID)
}

func (c *Context[S]) Emit(e Event) {
	if c.emitMW != nil {
		c.emitMW(c, e)
	}
	c.conn.Emit(e.Event(), e)
}

func (c *Context[S]) Broadcast(e Event) {
	c.s.ForEach(*c.roomID, func(c *Context[S]) {
		c.Emit(e)
	})
}

func (c *Context[S]) BroadcastToOthers(e Event) {
	c.s.ForEach(*c.roomID, func(cc *Context[S]) {
		if c.connID != cc.connID {
			cc.Emit(e)
		}
	})
}

func (c *Context[S]) ForEach(f func(c *Context[S])) {
	c.s.ForEach(*c.roomID, f)
}

func (c *Context[S]) Close() error {
	return c.conn.Close()
}

func (c *Context[S]) OnError(f func(c *Context[S], err error)) {
	c.errorMW = f
}

func (c *Context[S]) OnEmit(f func(c *Context[S], e Event)) {
	c.emitMW = f
}

func (c *Context[S]) Error(err error) {
	if c.errorMW != nil {
		c.errorMW(c, err)
	}
	c.conn.Emit("error", err.Error())
	if err = c.conn.Close(); err != nil {
		slog.Error("error closing connection", slogx.Err(err))
	}
}

func (c *Context[S]) WithS(s S) *Context[S] {
	return &Context[S]{
		Ctx:     c.Ctx,
		S:       s,
		roomID:  c.roomID,
		conn:    c.conn,
		connID:  c.connID,
		s:       c.s,
		emitMW:  c.emitMW,
		errorMW: c.errorMW,
	}
}

func (c *Context[S]) WithCtx(ctx context.Context) *Context[S] {
	return &Context[S]{
		Ctx:     ctx,
		S:       c.S,
		roomID:  c.roomID,
		conn:    c.conn,
		connID:  c.connID,
		s:       c.s,
		emitMW:  c.emitMW,
		errorMW: c.errorMW,
	}
}
