package state

import (
	"fmt"

	"github.com/mitchellh/mapstructure"
)

type AnyEvent struct {
	event string
	Data  any
}

func NewAnyEvent(event string, data any) AnyEvent {
	return AnyEvent{event, data}
}

func (we AnyEvent) Event() string {
	return we.event
}

func TypedMiddleware[S, E any](c *Context[S], event AnyEvent, next HandlerFunc[S, E]) error {
	var eventTyped E
	err := mapstructure.Decode(event.Data, &eventTyped)
	if err != nil {
		return fmt.Errorf("failed to decode event data: %w", err)
	}

	return next(c, eventTyped)
}

func WrapT[S, E any](f HandlerFunc[S, E]) HandlerFunc[S, AnyEvent] {
	return WithMiddleware(TypedMiddleware[S, E], f)
}

type eventHandler[S any, E Event] struct {
	handlers map[string]HandlerFunc[S, E]
}

func (eh *eventHandler[S, E]) Handle(c *Context[S], event E) error {
	handler, ok := eh.handlers[event.Event()]
	if !ok {
		return fmt.Errorf("no handler for event %s", event.Event())
	}

	return handler(c, event)
}

func NewGroup[S any, E Event]() *Group[S, E, E] {
	eh := &eventHandler[S, E]{
		handlers: make(map[string]HandlerFunc[S, E]),
	}
	return &Group[S, E, E]{
		handler: eh,
		applyMiddleware: func(hf HandlerFunc[S, E]) HandlerFunc[S, E] {
			return hf
		},
	}
}

func (eh *eventHandler[S, E]) Register(event string, handler HandlerFunc[S, E]) {
	eh.handlers[event] = handler
}

func GroupWithMW[S any, EH, E Event](
	g *Group[S, EH, E],
	middleware MiddlewareFunc[S, S, EH, E],
) *Group[S, EH, E] {
	return &Group[S, EH, E]{
		handler: g.handler,
		applyMiddleware: func(f HandlerFunc[S, E]) HandlerFunc[S, EH] {
			return WithMiddleware(middleware, f)
		},
	}
}

type Group[S any, EH, E Event] struct {
	handler         *eventHandler[S, EH]
	applyMiddleware func(HandlerFunc[S, E]) HandlerFunc[S, EH]
}

func (g *Group[S, EH, E]) Register(event string, handler HandlerFunc[S, E]) {
	g.handler.Register(event, g.applyMiddleware(handler))
}

func (g *Group[S, EH, E]) RootHandler() HandlerFunc[S, EH] {
	return g.handler.Handle
}
