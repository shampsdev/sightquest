package tests

import (
	"testing"

	"github.com/shampsdev/sightquest/server/e2e/framework"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"

	"github.com/stretchr/testify/assert"
)

var fw = framework.MustInit()

func TestMain(m *testing.M) {
	fw.RecordEvents(
		event.ErrorEvent,
		event.PlayerJoinedEvent,
		event.GameEvent,
		event.LocationUpdatedEvent,
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

	fw.Step("Location update", func() {
		cli1.Emit(event.LocationUpdate{
			Location: domain.Coordinate{
				Lon: 1,
				Lat: 2,
			},
		})
	}, 1)

	assert.NoError(t, cli1.Close())
	assert.NoError(t, cli2.Close())

	fw.AssertSession(t)
}
