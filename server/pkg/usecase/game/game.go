package game

import (
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"
)

type Game struct {
	game *domain.Game

	players map[string]*domain.Player
}

func NewGame(g *domain.Game) *Game {
	return &Game{
		game:    g,
		players: make(map[string]*domain.Player),
	}
}

func (g *Game) Active() bool {
	return true
}

func (g *Game) OnJoinGame(c Context) error {
	p := &domain.Player{
		User:   c.S.User,
		GameID: g.game.ID,
		Role:   "runner",
		Score:  0,
	}
	g.game.Players = append(g.game.Players, p)
	g.players[c.S.User.ID] = p

	c.JoinRoom(g.game.ID)
	c.BroadcastToOthers(event.PlayerJoined{Player: p})
	c.Emit(event.Game{Game: g.game})
	c.S.Player = p

	return nil
}

func (g *Game) OnLocationUpdate(c Context, ev event.LocationUpdate) error {
	g.players[c.S.User.ID].Location = ev.Location
	c.BroadcastToOthers(event.LocationUpdate{Location: ev.Location})
	return nil
}

func (g *Game) OnBroadcast(c Context, ev event.Broadcast) error {
	c.Broadcast(event.Broadcasted{
		From: c.S.Player,
		Data: ev.Data,
	})
	return nil
}
