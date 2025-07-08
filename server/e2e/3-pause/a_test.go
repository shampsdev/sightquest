package tests

import (
	"testing"

	"github.com/shampsdev/sightquest/server/e2e/framework"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"

	"github.com/stretchr/testify/assert"
)

var fw = framework.MustInit()

func TestMain(m *testing.M) {
	fw.RecordEvents(
		event.ErrorEvent,
		event.PauseEvent,
		event.UnpauseEvent,
		event.PollEvent,
	)
	fw.TestMain(m)
}

func Test(t *testing.T) {
	cli1 := fw.MustNewClient("user1")
	cli2 := fw.MustNewClient("user2")
	game := cli1.MustCreateGame()
	fw.Step("User1 joining game", func() {
		cli1.JoinGame(game)
	}, 2)
	fw.Step("User2 joining game", func() {
		cli2.JoinGame(game)
	}, 3)

	fw.Step("Set route", func() {
		cli1.Emit(event.SetRoute{
			RouteID: "route-1-id",
		})
	}, 2)

	fw.Step("Start game", func() {
		cli1.Emit(event.StartGame{})
	}, 4)

	fw.Step("Pause", func() {
		cli1.Emit(event.Pause{PollDuration: 100})
	}, 2)

	fw.Step("Unpause", func() {
		cli2.Emit(event.Unpause{})
	}, 4)

	fw.Step("Small pause", func() {
		cli1.Emit(event.Pause{PollDuration: 3})
	}, 2)

	fw.Step("Wait for small pause end", func() {
	}, 2)

	assert.NoError(t, cli1.Close())
	assert.NoError(t, cli2.Close())

	fw.AssertSession(t)
}
