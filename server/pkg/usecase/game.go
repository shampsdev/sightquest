package usecase

import (
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

func (g *Game) CreateGame(ctx *Context) (*domain.GameFull, error) {
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

func (g *Game) GetGameByID(ctx *Context, id string) (*domain.GameFull, error) {
	game, err := g.gameRepo.GetGameByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get game: %w", err)
	}
	if ctx.UserID != game.Admin.ID {
		return nil, fmt.Errorf("not allowed")
	}
	return game, nil
}
