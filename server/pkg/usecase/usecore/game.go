package usecore

import (
	"context"
	"fmt"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type Game struct {
	gameRepo   repo.Game
	playerRepo repo.Player
}

func NewGame(gameRepo repo.Game, playerRepo repo.Player) *Game {
	return &Game{gameRepo: gameRepo, playerRepo: playerRepo}
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
	game, err := repo.First(g.gameRepo)(ctx, &domain.FilterGame{
		ID:           &id,
		IncludeAdmin: true,
		IncludeRoute: true,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get game: %w", err)
	}
	game.Players, err = g.playerRepo.Filter(ctx, &domain.FilterPlayer{GameID: &id})
	if err != nil {
		return nil, fmt.Errorf("failed to get game players: %w", err)
	}
	return game, nil
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

func (g *Game) SetGameRoute(ctx context.Context, gameID, routeID string) error {
	err := g.gameRepo.Patch(ctx, gameID, &domain.PatchGame{
		RouteID: &routeID,
	})
	if err != nil {
		return fmt.Errorf("failed to set game route: %w", err)
	}
	return nil
}
