package tests

import (
	"testing"

	"github.com/shampsdev/sightquest/server/e2e/framework"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"
	"github.com/shampsdev/sightquest/server/pkg/utils"

	"github.com/stretchr/testify/assert"
)

var fw = framework.MustInit()

func TestMain(m *testing.M) {
	fw.RecordEvents(
		event.ErrorEvent,
		event.PollEvent,
		event.ScoreUpdatedEvent,
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

	fw.Step("User1 completes task", func() {
		cli1.Emit(event.TaskComplete{
			PollDuration: utils.PtrTo(3),
			TaskID:       "taskpoint-1-id",
			Photo:        "cot-photo",
		})
	}, 2)

	fw.Step("Vote and wait for end", func() {
		cli2.Emit(event.TaskApprove{Comment: "Cool!"})
	}, 6)

	fw.Step("User2 completes task", func() {
		cli1.Emit(event.TaskComplete{
			PollDuration: utils.PtrTo(100),
			TaskID:       "taskpoint-2-id",
			Photo:        "dag-photo",
		})
	}, 2)

	fw.Step("Reject and wait for end", func() {
		cli2.Emit(event.TaskReject{Comment: "Not cool!"})
	}, 4)

	fw.Step("User1 completes task", func() {
		cli1.Emit(event.TaskComplete{
			PollDuration: utils.PtrTo(100),
			TaskID:       "taskpoint-3-id",
			Photo:        "bird-photo",
		})
	}, 2)

	fw.Step("Both approve", func() {
		cli1.Emit(event.TaskApprove{Comment: "Cool!"})
		cli2.Emit(event.TaskApprove{Comment: "Cool!"})
	}, 8)

	assert.NoError(t, cli1.Close())
	assert.NoError(t, cli2.Close())

	fw.AssertSession(t)
}
