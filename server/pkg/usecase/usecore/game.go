package usecore

import (
	"context"
	"fmt"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type Game struct {
	gameRepo repo.Game
}

func NewGame(gameRepo repo.Game) *Game {
	return &Game{gameRepo: gameRepo}
}

func (g *Game) CreateGame(ctx *Context) (*domain.Game, error) {
	cg := &domain.CreateGame{
		AdminID: ctx.UserID,
		State:   domain.GameStateLobby,
	}
	id, err := g.gameRepo.Create(ctx, cg)
	if err != nil {
		return nil, fmt.Errorf("failed to create game: %w", err)
	}
	return repo.First(g.gameRepo)(ctx, &domain.FilterGame{ID: &id})
}

func (g *Game) GetGameByID(ctx context.Context, id string) (*domain.Game, error) {
	return repo.First(g.gameRepo)(ctx, &domain.FilterGame{ID: &id})
}

func (g *Game) UpdateGame(ctx context.Context, gameID string, patch *domain.PatchGame) error {
	err := g.gameRepo.Patch(ctx, gameID, patch)
	if err != nil {
		return fmt.Errorf("failed to update game: %w", err)
	}
	return nil
}

func (g *Game) GetLastGamesByPlayer(ctx context.Context, playerID string, limit int) ([]*domain.Game, error) {
	if limit <= 0 {
		return nil, fmt.Errorf("limit must be positive")
	}

	games, err := g.gameRepo.Filter(ctx, &domain.FilterGame{
		PlayerID:            &playerID,
		SortByCreatedAtDesc: true,
		Limit:               &limit,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get player games: %w", err)
	}

	return games, nil
}
