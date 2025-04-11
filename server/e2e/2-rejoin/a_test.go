package tests

import (
	"maps"
	"slices"
	"testing"
	"time"

	socketio "github.com/googollee/go-socket.io"
	"github.com/shampsdev/sightquest/server/e2e/framework"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"

	"github.com/stretchr/testify/assert"
)

var fw = framework.MustInit()

func TestMain(m *testing.M) {
	fw.RecordEvents(slices.Collect(maps.Keys(framework.AllEvents))...)
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
	fw.Step("User2 leaving game", func() {
		cli2.Emit(event.LeaveGame{})
		time.Sleep(1 * time.Second)
		assert.NoError(t, cli2.Close())
		time.Sleep(1 * time.Second)
	}, 1)

	cli3 := fw.MustNewClient("user3")
	fw.Step("User3 joining game", func() {
		cli3.JoinGame(game)
	}, 3)

	fw.Step("Start game", func() {
		cli1.Emit(event.StartGame{})
	}, 2)

	fw.Step("User1 disconnect", func() {
		cli1.Emit(event.LeaveGame{})
		time.Sleep(1 * time.Second)
		assert.NoError(t, cli1.Close())
		time.Sleep(1 * time.Second)
	}, 0)

	fw.Step("User1 reconnect", func() {
		newCli1, err := socketio.NewClient(fw.SIOHost, nil)
		assert.NoError(t, err)
		cli1.Cli = newCli1
		cli1.Setup(framework.AllEvents)
		assert.NoError(t, cli1.Cli.Connect())

		cli1.JoinGame(game)
	}, 2)

	assert.NoError(t, cli1.Close())
	assert.NoError(t, cli2.Close())

	fw.AssertSession(t)
}
