package state

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
