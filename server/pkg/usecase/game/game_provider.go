package game

import (
	"context"
	"fmt"
	"log/slog"
	"sync"
	"sync/atomic"
	"time"

	"github.com/shampsdev/sightquest/server/pkg/usecase/usecore"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

type InMemoryGameRepo struct {
	gameCase   *usecore.Game
	playerCase *usecore.Player
	routeCase  *usecore.Route

	gamesMutex sync.RWMutex
	games      map[string]*Game
}

func NewInMemoryGameRepo(
	ctx context.Context,
	gameCase *usecore.Game,
	playerCase *usecore.Player,
	routeCase *usecore.Route,
) *InMemoryGameRepo {
	r := &InMemoryGameRepo{
		gameCase:   gameCase,
		games:      make(map[string]*Game),
		playerCase: playerCase,
		routeCase:  routeCase,
	}

	r.goGC(ctx)
	return r
}

func (r *InMemoryGameRepo) GetGame(ctx context.Context, id string) (*Game, error) {
	r.gamesMutex.Lock()
	defer r.gamesMutex.Unlock()
	game, ok := r.games[id]
	if !ok {
		game, err := NewGame(ctx, id, r.gameCase, r.playerCase, r.routeCase)
		if err != nil {
			return nil, fmt.Errorf("failed to create game: %w", err)
		}
		r.games[id] = game
		return game, nil
	}

	return game, nil
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
					if !game.Active() {
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
