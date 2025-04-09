package state

import (
	"fmt"

	"github.com/mitchellh/mapstructure"
)

type MiddlewareFunc[SIn, SOut any, EIn, EOut Event] func(
	c *Context[SIn], event EIn, next HandlerFunc[SOut, EOut]) error

func WithMiddleware[SIn, SOut any, EIn, EOut Event](
	middleware MiddlewareFunc[SIn, SOut, EIn, EOut],
	next HandlerFunc[SOut, EOut],
) HandlerFunc[SIn, EIn] {
	return func(c *Context[SIn], event EIn) error {
		return middleware(c, event, next)
	}
}

func TypedMiddleware[S any, E Event](c *Context[S], event AnyEvent, next HandlerFunc[S, E]) error {
	var eventTyped E
	err := mapstructure.Decode(event.Data, &eventTyped)
	if err != nil {
		return fmt.Errorf("failed to decode event data: %w", err)
	}

	return next(c, eventTyped)
}

func WrapT[S any, E Event](f HandlerFunc[S, E]) HandlerFunc[S, AnyEvent] {
	return WithMiddleware(TypedMiddleware[S, E], f)
}
