package game

import (
	"context"
	"fmt"
	"slices"
	"time"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"
	"github.com/shampsdev/sightquest/server/pkg/usecase/state"
	"github.com/shampsdev/sightquest/server/pkg/usecase/usecore"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

type Game struct {
	game *domain.Game

	// playerID to last activity, empty if disconnected
	activity map[string]time.Time
	maxIdle  time.Duration

	playerCase *usecore.Player
	gameCase   *usecore.Game
}

func NewGame(
	ctx context.Context,
	gameID string,
	gameCase *usecore.Game,
	playerCase *usecore.Player,
) (*Game, error) {
	g := &Game{
		activity:   make(map[string]time.Time),
		maxIdle:    10 * time.Minute,
		playerCase: playerCase,
		gameCase:   gameCase,
	}

	game, err := gameCase.GetGameByID(ctx, gameID)
	if err != nil {
		return nil, fmt.Errorf("failed to get game: %w", err)
	}

	g.game = game

	players, err := playerCase.GetPlayersByGameID(ctx, gameID)
	if err != nil {
		return nil, fmt.Errorf("failed to get players: %w", err)
	}
	for _, p := range players {
		g.appendPlayer(p)
	}

	return g, nil
}

func (g *Game) appendPlayer(p *domain.Player) {
	g.game.Players = append(g.game.Players, p)
}

func (g *Game) deletePlayer(playerID string) {
	for i, p := range g.game.Players {
		if p.User.ID == playerID {
			g.game.Players = slices.Delete(g.game.Players, i, i+1)
			break
		}
	}
}

func (g *Game) getPlayer(playerID string) (*domain.Player, bool) {
	for _, p := range g.game.Players {
		if p.User.ID == playerID {
			return p, true
		}
	}
	return nil, false
}

func (g *Game) Active() bool {
	active := false
	for _, a := range g.activity {
		if time.Since(a) < g.maxIdle {
			active = true
			break
		}
	}
	return active
}

func recordGameActivityMW[E any](c Context, e E, next state.HandlerFunc[*PlayerState, E]) error {
	c.S.Game.activity[c.S.User.ID] = time.Now()
	return next(c, e)
}

func (g *Game) OnJoinGame(c Context) error {
	switch g.game.State {
	case domain.GameStateLobby:
		createPlayer := &domain.CreatePlayer{
			UserID:   c.S.User.ID,
			GameID:   g.game.ID,
			Role:     "runner",
			Score:    0,
			Location: domain.Coordinate{},
		}

		p, err := g.playerCase.CreatePlayer(c.Ctx, createPlayer)
		if err != nil {
			return fmt.Errorf("failed to create player: %w", err)
		}
		g.appendPlayer(p)
		c.S.Player = p
	case domain.GameStateGame, domain.GameStatePoll:
		p, ok := g.getPlayer(c.S.User.ID)
		if !ok {
			return fmt.Errorf("player not found, can't add new in state %s", g.game.State)
		}
		c.S.Player = p
	case domain.GameStateFinished:
		return fmt.Errorf("can't connect to finished game, goodbye")
	}

	c.JoinRoom(g.game.ID)
	c.Emit(event.Game{Game: g.game})
	if g.game.State == domain.GameStateLobby {
		c.BroadcastToOthers(event.PlayerJoined{Player: c.S.Player})
	}
	g.activity[c.S.User.ID] = time.Now()
	return nil
}

func (g *Game) OnDisconnect(c Context) error {
	log := slogx.FromCtx(c.Ctx).With("game_state", g.game.State)
	log.Debug("player disconnected")

	if g.game.State == domain.GameStateLobby {
		log.Debug("removing player from game")
		g.deletePlayer(c.S.User.ID)
		c.BroadcastToOthers(event.PlayerLeft{Player: c.S.Player})
		err := g.playerCase.DeletePlayer(c.Ctx, g.game.ID, c.S.User.ID)
		if err != nil {
			return fmt.Errorf("failed to delete player: %w", err)
		}
	}

	delete(g.activity, c.S.Player.User.ID)
	c.LeaveRoom(g.game.ID)
	log.Debug("player gracefully disconnected")
	return nil
}

func (g *Game) OnStartGame(c Context, _ event.StartGame) error {
	if g.game.State != domain.GameStateLobby {
		return fmt.Errorf("can't start game, game is not in lobby")
	}

	g.game.State = domain.GameStateGame
	err := g.gameCase.UpdateGame(c.Ctx, g.game.ID, &domain.PatchGame{
		State: &g.game.State,
	})
	if err != nil {
		return fmt.Errorf("failed to update game: %w", err)
	}
	c.Broadcast(event.StartGame{})
	return nil
}

func (g *Game) OnLocationUpdate(c Context, ev event.LocationUpdate) error {
	c.S.Player.Location = ev.Location
	c.BroadcastToOthers(event.LocationUpdated{Player: c.S.Player, Location: ev.Location})

	return nil
}

func (g *Game) OnBroadcast(c Context, ev event.Broadcast) error {
	c.Broadcast(event.Broadcasted{
		From: c.S.Player,
		Data: ev.Data,
	})
	return nil
}
