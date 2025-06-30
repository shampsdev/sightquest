package game

import (
	"context"
	"fmt"
	"slices"
	"sync"
	"time"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"
	"github.com/shampsdev/sightquest/server/pkg/usecase/state"
	"github.com/shampsdev/sightquest/server/pkg/usecase/usecore"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

type Game struct {
	lock sync.Mutex

	game *domain.Game

	// playerID to last activity, empty if disconnected
	activity map[string]time.Time
	maxIdle  time.Duration

	playerCase *usecore.Player
	gameCase   *usecore.Game
	routeCase  *usecore.Route
	pollRepo   repo.Poll
	voteRepo   repo.Vote

	server state.Server[*PlayerState]
}

func NewGame(
	ctx context.Context,
	gameID string,
	gameCase *usecore.Game,
	playerCase *usecore.Player,
	routeCase *usecore.Route,
	pollRepo repo.Poll,
	voteRepo repo.Vote,
	server state.Server[*PlayerState],
) (*Game, error) {
	g := &Game{
		activity:   make(map[string]time.Time),
		maxIdle:    10 * time.Minute,
		playerCase: playerCase,
		gameCase:   gameCase,
		routeCase:  routeCase,
		pollRepo:   pollRepo,
		voteRepo:   voteRepo,
		server:     server,
	}

	game, err := gameCase.GetGameByID(ctx, gameID)
	if err != nil {
		return nil, fmt.Errorf("failed to get game: %w", err)
	}
	g.game = game

	for _, p := range g.game.Players {
		g.appendPlayer(p)
	}

	go g.pollObserver(ctx)

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

func lockGameMW[E any](c Context, e E, next state.HandlerFunc[*PlayerState, E]) error {
	c.S.Game.lock.Lock()
	defer c.S.Game.lock.Unlock()
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

func (g *Game) OnPause(c Context, ev event.Pause) error {
	if g.game.ActivePoll != nil {
		return fmt.Errorf("can't set pause, game is in poll")
	}

	pausePollCreate := &domain.CreatePoll{
		GameID:   g.game.ID,
		Type:     domain.PollTypePause,
		Duration: &ev.Duration,
		Data: &domain.PollData{
			Pause: &domain.PollDataPause{
				PausedBy: c.S.Player,
				Duration: ev.Duration,
			},
		},
	}

	id, err := g.pollRepo.Create(c.Ctx, pausePollCreate)
	if err != nil {
		return fmt.Errorf("failed to create poll: %w", err)
	}
	poll, err := repo.First(g.pollRepo)(c.Ctx, &domain.FilterPoll{
		ID: &id,
	})
	if err != nil {
		return fmt.Errorf("failed to get poll: %w", err)
	}
	g.game.ActivePoll = poll

	c.Broadcast(event.Paused{
		PollDataPause: *pausePollCreate.Data.Pause,
	})

	return nil
}

func (g *Game) OnUnpause(c Context, _ event.Unpause) error {
	if g.game.ActivePoll == nil {
		return fmt.Errorf("can't unpause, game is not in pause")
	}
	if g.game.ActivePoll.Type != domain.PollTypePause {
		return fmt.Errorf("can't unpause, game is not in pause")
	}

	c.Broadcast(event.Unpaused{
		UnpausedBy: c.S.Player,
	})

	err := g.voteInActive(c, domain.VoteTypeUnpause, nil)
	if err != nil {
		return fmt.Errorf("failed to vote in active: %w", err)
	}

	g.game.ActivePoll = nil

	return nil
}

func (g *Game) OnSetRoute(c Context, ev event.SetRoute) error {
	if err := g.routeCase.EnsureRouteBought(c.Ctx, c.S.User.ID, ev.RouteID); err != nil {
		return fmt.Errorf("failed to ensure route is bought: %w", err)
	}

	route, err := g.routeCase.GetRouteByID(c.Ctx, ev.RouteID)
	if err != nil {
		return fmt.Errorf("failed to get route: %w", err)
	}

	g.game.Route = route
	c.Broadcast(event.SettedRoute{
		Route: route,
	})
	return nil
}
