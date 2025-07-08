package game

import (
	"context"
	"fmt"
	"math/rand"
	"slices"
	"sync"
	"time"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"
	"github.com/shampsdev/sightquest/server/pkg/usecase/state"
	"github.com/shampsdev/sightquest/server/pkg/usecase/usecore"
	"github.com/shampsdev/sightquest/server/pkg/utils"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

type Game struct {
	lock sync.Mutex

	game *domain.Game

	// playerID to last activity, empty if disconnected
	activity map[string]time.Time
	maxIdle  time.Duration

	playerCase             *usecore.Player
	gameCase               *usecore.Game
	routeCase              *usecore.Route
	pollRepo               repo.Poll
	voteRepo               repo.Vote
	completedTaskPointRepo repo.CompletedTaskPoint

	server state.Server[*PlayerState]
}

func NewGame(
	ctx context.Context,
	gameID string,
	server state.Server[*PlayerState],
	gameCase *usecore.Game,
	playerCase *usecore.Player,
	routeCase *usecore.Route,
	pollRepo repo.Poll,
	voteRepo repo.Vote,
	completedTaskPointRepo repo.CompletedTaskPoint,
) (*Game, error) {
	g := &Game{
		activity:               make(map[string]time.Time),
		maxIdle:                10 * time.Minute,
		playerCase:             playerCase,
		gameCase:               gameCase,
		routeCase:              routeCase,
		pollRepo:               pollRepo,
		voteRepo:               voteRepo,
		completedTaskPointRepo: completedTaskPointRepo,
		server:                 server,
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
	c.S.Game.activity[c.S.User.ID] = time.Now().UTC()
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
	g.activity[c.S.User.ID] = time.Now().UTC()
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
	if g.game.Route == nil {
		return fmt.Errorf("can't start game, route is not set")
	}

	g.game.State = domain.GameStateGame
	err := g.gameCase.UpdateGame(c.Ctx, g.game.ID, &domain.PatchGame{
		State: &g.game.State,
	})
	if err != nil {
		return fmt.Errorf("failed to update game: %w", err)
	}
	c.Broadcast(event.StartGame{})

	runner := g.game.Players[rand.Intn(len(g.game.Players))]
	runner.Role = domain.PlayerRoleRunner
	err = g.playerCase.UpdatePlayer(c.Ctx, runner.GameID, runner.User.ID, &domain.PatchPlayer{Role: &runner.Role})
	if err != nil {
		return fmt.Errorf("failed to update player: %w", err)
	}
	c.Broadcast(event.PlayerRoleUpdated{
		Player: runner,
		Role:   runner.Role,
	})
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
	_, err := g.createActivePoll(c, &domain.CreatePoll{
		GameID:   g.game.ID,
		Type:     domain.PollTypePause,
		State:    domain.PollStateActive,
		Duration: &ev.PollDuration,
		Data: &domain.PollData{
			Pause: &domain.PollDataPause{
				PausedBy: c.S.Player,
				Duration: ev.PollDuration,
			},
		},
	})
	if err != nil {
		return fmt.Errorf("failed to create active poll: %w", err)
	}

	return nil
}

func (g *Game) OnUnpause(c Context, _ event.Unpause) error {
	return g.onVote(c,
		domain.PollTypePause,
		domain.VoteTypeUnpause,
		nil,
	)
}

func (g *Game) OnTaskComplete(c Context, ev event.TaskComplete) error {
	var task *domain.TaskPoint

	for _, t := range g.game.Route.TaskPoints {
		if t.ID == ev.TaskID {
			task = t
			break
		}
	}
	if task == nil {
		return fmt.Errorf("task not found")
	}

	if ev.PollDuration == nil {
		ev.PollDuration = utils.PtrTo(45)
	}

	_, err := g.createActivePoll(c, &domain.CreatePoll{
		GameID:   g.game.ID,
		Type:     domain.PollTypeTaskComplete,
		State:    domain.PollStateActive,
		Duration: ev.PollDuration,
		Data: &domain.PollData{
			TaskComplete: &domain.PollDataTaskComplete{
				Task:   task,
				Player: c.S.Player,
				Photo:  ev.Photo,
			},
		},
	})
	if err != nil {
		return fmt.Errorf("failed to create active poll: %w", err)
	}

	return nil
}

func (g *Game) OnTaskApprove(c Context, ev event.TaskApprove) error {
	return g.onVote(c,
		domain.PollTypeTaskComplete,
		domain.VoteTypeTaskApprove,
		&domain.VoteData{
			Comment: ev.Comment,
		},
	)
}

func (g *Game) OnTaskReject(c Context, ev event.TaskReject) error {
	return g.onVote(c,
		domain.PollTypeTaskComplete,
		domain.VoteTypeTaskReject,
		&domain.VoteData{
			Comment: ev.Comment,
		},
	)
}

func (g *Game) OnPlayerCatch(c Context, ev event.PlayerCatch) error {
	player, ok := g.getPlayer(ev.PlayerID)
	if !ok {
		return fmt.Errorf("player not found")
	}
	if player.Role != domain.PlayerRoleRunner {
		return fmt.Errorf("player is not a runner")
	}

	if ev.PollDuration == nil {
		ev.PollDuration = utils.PtrTo(45)
	}

	_, err := g.createActivePoll(c, &domain.CreatePoll{
		GameID:   g.game.ID,
		Type:     domain.PollTypePlayerCatch,
		State:    domain.PollStateActive,
		Duration: ev.PollDuration,
		Data: &domain.PollData{
			PlayerCatch: &domain.PollDataPlayerCatch{
				Runner:    player,
				CatchedBy: c.S.Player,
				Photo:     ev.Photo,
			},
		},
	})
	if err != nil {
		return fmt.Errorf("failed to create active poll: %w", err)
	}

	return nil
}

func (g *Game) OnPlayerCatchApprove(c Context, ev event.PlayerCatchApprove) error {
	return g.onVote(c,
		domain.PollTypePlayerCatch,
		domain.VoteTypePlayerCatchApprove,
		&domain.VoteData{
			Comment: ev.Comment,
		},
	)
}

func (g *Game) OnPlayerCatchReject(c Context, ev event.PlayerCatchReject) error {
	return g.onVote(c,
		domain.PollTypePlayerCatch,
		domain.VoteTypePlayerCatchReject,
		&domain.VoteData{
			Comment: ev.Comment,
		},
	)
}

func (g *Game) OnFinishGame(c Context, ev event.FinishGame) error {
	duration := utils.PtrTo(45)
	if ev.PollDuration != nil {
		duration = ev.PollDuration
	}
	_, err := g.createActivePoll(c, &domain.CreatePoll{
		GameID:   g.game.ID,
		Type:     domain.PollTypeFinishGame,
		State:    domain.PollStateActive,
		Duration: duration,
	})
	if err != nil {
		return fmt.Errorf("failed to create active poll: %w", err)
	}

	return nil
}

func (g *Game) OnFinishGameApprove(c Context, ev event.FinishGameApprove) error {
	return g.onVote(c,
		domain.PollTypeFinishGame,
		domain.VoteTypeFinishGameApprove,
		&domain.VoteData{
			Comment: ev.Comment,
		},
	)
}

func (g *Game) OnFinishGameReject(c Context, ev event.FinishGameReject) error {
	return g.onVote(c,
		domain.PollTypeFinishGame,
		domain.VoteTypeFinishGameReject,
		&domain.VoteData{
			Comment: ev.Comment,
		},
	)
}

func (g *Game) doRotation(
	ctx context.Context, runner, catchedBy *domain.Player,
) (catcherReward int, newRunner *domain.Player, err error) {
	catcherReward, newRunner = g.rotation(runner, catchedBy)

	runner.Role = domain.PlayerRoleCatcher
	err = g.playerCase.UpdatePlayer(ctx, runner.GameID, runner.User.ID, &domain.PatchPlayer{Role: utils.PtrTo(domain.PlayerRoleCatcher)})
	if err != nil {
		return 0, nil, fmt.Errorf("failed to update player: %w", err)
	}
	g.broadcast(event.PlayerRoleUpdated{Player: runner, Role: domain.PlayerRoleCatcher})

	catchedBy.Score += catcherReward
	err = g.playerCase.UpdatePlayer(ctx, catchedBy.GameID, catchedBy.User.ID, &domain.PatchPlayer{Score: utils.PtrTo(catchedBy.Score)})
	if err != nil {
		return 0, nil, fmt.Errorf("failed to update player: %w", err)
	}
	g.broadcast(event.ScoreUpdated{
		Player:     catchedBy,
		DeltaScore: catcherReward,
		Score:      catchedBy.Score,
		Reason:     fmt.Sprintf("Игрок %s поймал игрока %s", runner.User.Name, catchedBy.User.Name),
	})

	newRunner.Role = domain.PlayerRoleRunner
	err = g.playerCase.UpdatePlayer(ctx, newRunner.GameID, newRunner.User.ID, &domain.PatchPlayer{Role: utils.PtrTo(domain.PlayerRoleRunner)})
	if err != nil {
		return 0, nil, fmt.Errorf("failed to update player: %w", err)
	}
	g.broadcast(event.PlayerRoleUpdated{Player: newRunner, Role: domain.PlayerRoleRunner})

	return catcherReward, newRunner, nil
}

func (g *Game) rotation(
	runner, catchedBy *domain.Player,
) (catcherReward int, newRunner *domain.Player) {
	playersWeights := make([]int, len(g.game.Players))
	for i, p := range g.game.Players {
		switch p.User.ID {
		case runner.User.ID:
			playersWeights[i] = 1
		case catchedBy.User.ID:
			playersWeights[i] = 25
		default:
			playersWeights[i] = 5
		}
	}

	newRunner = utils.RandomChoice(g.game.Players, playersWeights)
	catcherReward = 80 + rand.Intn(40)
	return catcherReward, newRunner
}

func (g *Game) finishGame(ctx context.Context) error {
	g.game.State = domain.GameStateFinished
	err := g.gameCase.UpdateGame(ctx, g.game.ID, &domain.PatchGame{
		State: &g.game.State,
	})
	if err != nil {
		return fmt.Errorf("failed to update game: %w", err)
	}

	g.broadcast(event.FinishedGame{})
	return nil
}

func (g *Game) onVote(c Context, pollType domain.PollType, voteType domain.VoteType, data *domain.VoteData) error {
	if err := g.ensurePollType(pollType); err != nil {
		return fmt.Errorf("failed to ensure poll type: %w", err)
	}

	err := g.voteInActive(c, voteType, data)
	if err != nil {
		return fmt.Errorf("failed to vote in active: %w", err)
	}

	return nil
}

func (g *Game) createActivePoll(c Context, poll *domain.CreatePoll) (*domain.Poll, error) {
	if g.game.ActivePoll != nil {
		return nil, fmt.Errorf("game is in poll")
	}
	id, err := g.pollRepo.Create(c.Ctx, poll)
	if err != nil {
		return nil, fmt.Errorf("failed to create poll: %w", err)
	}
	created, err := repo.First(g.pollRepo)(c.Ctx, &domain.FilterPoll{
		ID: &id,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get poll: %w", err)
	}
	g.game.ActivePoll = created
	c.Broadcast(event.Poll{Poll: created})
	g.game.State = domain.GameStatePoll
	err = g.gameCase.UpdateGame(c.Ctx, g.game.ID, &domain.PatchGame{
		State: &g.game.State,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to update game: %w", err)
	}

	return created, nil
}

func (g *Game) ensurePollType(pollType domain.PollType) error {
	if g.game.ActivePoll == nil {
		return fmt.Errorf("game is not in poll")
	}
	if g.game.ActivePoll.Type != pollType {
		return fmt.Errorf("game is not in poll of type %s", pollType)
	}
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
