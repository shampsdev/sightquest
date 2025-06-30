package game

import (
	"context"
	"fmt"
	"log/slog"
	"sync"
	"sync/atomic"
	"time"

	"github.com/shampsdev/sightquest/server/pkg/repo"
	"github.com/shampsdev/sightquest/server/pkg/usecase/state"
	"github.com/shampsdev/sightquest/server/pkg/usecase/usecore"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

type InMemoryGameRepo struct {
	gameCase   *usecore.Game
	playerCase *usecore.Player
	routeCase  *usecore.Route
	pollRepo   repo.Poll
	voteRepo   repo.Vote

	gamesMutex sync.RWMutex
	games      map[string]gameWithContext
}

type gameWithContext struct {
	game   *Game
	ctx    context.Context
	cancel context.CancelFunc
}

func NewInMemoryGameRepo(
	ctx context.Context,
	gameCase *usecore.Game,
	playerCase *usecore.Player,
	routeCase *usecore.Route,
	pollRepo repo.Poll,
	voteRepo repo.Vote,
) *InMemoryGameRepo {
	r := &InMemoryGameRepo{
		gameCase:   gameCase,
		games:      make(map[string]gameWithContext),
		playerCase: playerCase,
		routeCase:  routeCase,
		pollRepo:   pollRepo,
		voteRepo:   voteRepo,
	}

	r.goGC(ctx)
	return r
}

func (r *InMemoryGameRepo) GetGame(ctx context.Context, id string, server state.Server[*PlayerState]) (*Game, error) {
	r.gamesMutex.Lock()
	defer r.gamesMutex.Unlock()
	game, ok := r.games[id]
	if !ok {
		ctx, cancel := context.WithCancel(ctx)
		game, err := NewGame(ctx, id, r.gameCase, r.playerCase, r.routeCase, r.pollRepo, r.voteRepo, server)
		if err != nil {
			cancel()
			return nil, fmt.Errorf("failed to create game: %w", err)
		}
		r.games[id] = gameWithContext{
			game:   game,
			ctx:    ctx,
			cancel: cancel,
		}
		return game, nil
	}

	return game.game, nil
}

func (r *InMemoryGameRepo) goGC(ctx context.Context) {
	ticker := time.NewTicker(time.Minute)
	go func() {
		for {
			select {
			case <-ticker.C:
				r.gamesMutex.Lock()
				var deleted atomic.Int32
				for id, game := range r.games {
					if !game.game.Active() {
						game.cancel()
						delete(r.games, id)
						deleted.Add(1)
					}
				}
				slogx.Info(ctx, "GC passed", "games_amount", len(r.games), "deleted_amount", deleted.Load())
				r.gamesMutex.Unlock()
			case <-ctx.Done():
				return
			}
		}
	}()
}

func (r *InMemoryGameRepo) DeleteGame(ctx context.Context, id string) error {
	r.gamesMutex.Lock()
	defer r.gamesMutex.Unlock()
	delete(r.games, id)
	slogx.Info(ctx, "Delete game", slog.String("game_id", id))
	return nil
}
