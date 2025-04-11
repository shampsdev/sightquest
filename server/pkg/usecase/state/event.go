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

func (eh *eventHandler[S, E]) RegisteredEvents() []string {
	var events []string
	for event := range eh.handlers {
		events = append(events, event)
	}
	return events
}

func NewGroup[S any, E Event]() *Group[S, E, E] {
	eh := &eventHandler[S, E]{
		handlers: make(map[string]HandlerFunc[S, E]),
	}
	return &Group[S, E, E]{
		handler: eh,
		applyMW: func(hf HandlerFunc[S, E]) HandlerFunc[S, E] {
			return hf
		},
	}
}

func (eh *eventHandler[S, E]) On(event string, handler HandlerFunc[S, E]) {
	eh.handlers[event] = handler
}

func GroupMW[S any, ERoot, EOld, ENew Event](
	g *Group[S, ERoot, EOld],
	middleware MiddlewareFunc[S, S, EOld, ENew],
) *Group[S, ERoot, ENew] {
	return &Group[S, ERoot, ENew]{
		handler: g.handler,
		applyMW: func(hf HandlerFunc[S, ENew]) HandlerFunc[S, ERoot] {
			return g.applyMW(WithMiddleware(middleware, hf))
		},
	}
}

type Group[S any, ERoot, E Event] struct {
	handler *eventHandler[S, ERoot]
	applyMW func(HandlerFunc[S, E]) HandlerFunc[S, ERoot]
}

func (g *Group[S, ERoot, E]) On(event string, handler HandlerFunc[S, E]) *Group[S, ERoot, E] {
	g.handler.On(event, g.applyMW(handler))
	return g
}

func (g *Group[S, ERoot, E]) RootHandler() HandlerFunc[S, ERoot] {
	return g.handler.Handle
}

func (g *Group[S, ERoot, E]) RegisteredEvents() []string {
	return g.handler.RegisteredEvents()
}
