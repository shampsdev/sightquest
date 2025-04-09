package game

import (
	"context"
	"log/slog"
	"sync"
	"sync/atomic"
	"time"

	"github.com/shampsdev/sightquest/server/pkg/usecase/usecore"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

type InMemoryGameRepo struct {
	gameCase *usecore.Game

	gamesMutex  sync.RWMutex
	games       map[string]*Game
	activeGames map[string]time.Time
}

func NewInMemoryGameRepo(ctx context.Context, gameCase *usecore.Game) *InMemoryGameRepo {
	r := &InMemoryGameRepo{
		gameCase:    gameCase,
		games:       make(map[string]*Game),
		activeGames: make(map[string]time.Time),
	}

	r.goGC(ctx)
	return r
}

func (r *InMemoryGameRepo) GetGame(ctx context.Context, id string) (*Game, error) {
	r.gamesMutex.Lock()
	defer r.gamesMutex.Unlock()
	game, ok := r.games[id]
	if !ok {
		g, err := r.gameCase.GetGameByID(ctx, id)
		if err != nil {
			return nil, err
		}

		game := NewGame(g)
		r.games[id] = game
		r.activeGames[id] = time.Now()
		return game, nil
	}

	r.activeGames[id] = time.Now()
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
					if game.Active() {
						r.activeGames[id] = time.Now()
					} else {
						wasActive := r.activeGames[id]
						if time.Since(wasActive) > time.Minute*5 {
							delete(r.games, id)
							deleted.Add(1)
						}
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
