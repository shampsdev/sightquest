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
	id, err := g.gameRepo.CreateGame(ctx, cg)
	if err != nil {
		return nil, fmt.Errorf("failed to create game: %w", err)
	}
	game, err := g.gameRepo.GetGameByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get game: %w", err)
	}
	return game, nil
}

func (g *Game) GetGameByID(ctx context.Context, id string) (*domain.Game, error) {
	game, err := g.gameRepo.GetGameByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get game: %w", err)
	}
	return game, nil
}

func (g *Game) UpdateGame(ctx context.Context, game *domain.Game) error {
	err := g.gameRepo.UpdateGame(ctx, game)
	if err != nil {
		return fmt.Errorf("failed to update game: %w", err)
	}
	return nil
}
