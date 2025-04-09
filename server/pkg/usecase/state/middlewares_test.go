package state

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

type TState struct{}
type TEvent struct {
	X int
	Y string
}

func (e TEvent) Event() string {
	return "TEvent"
}

func TestMiddleware(t *testing.T) {
	tEventMap := map[string]any{
		"X": 1,
		"Y": "hello",
	}

	handlerCalled := false
	handler := func(_ *Context[TState], e TEvent) error {
		assert.Equal(t, e.X, 1)
		assert.Equal(t, e.Y, "hello")
		handlerCalled = true
		return nil
	}

	handlerWrapped := WithMiddleware(TypedMiddleware, handler)
	handlerWrapped(nil, NewAnyEvent("TEvent", tEventMap))
	assert.Equal(t, handlerCalled, true)
}
