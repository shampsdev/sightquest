package usecore

import (
	"context"
	"errors"
	"fmt"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
	"github.com/shampsdev/sightquest/server/pkg/utils"
)

type Game struct {
	gameRepo               repo.Game
	playerRepo             repo.Player
	pollRepo               repo.Poll
	voteRepo               repo.Vote
	completedTaskPointRepo repo.CompletedTaskPoint
}

func NewGame(
	gameRepo repo.Game,
	playerRepo repo.Player,
	pollRepo repo.Poll,
	voteRepo repo.Vote,
	completedTaskPointRepo repo.CompletedTaskPoint,
) *Game {
	return &Game{
		gameRepo:               gameRepo,
		playerRepo:             playerRepo,
		pollRepo:               pollRepo,
		voteRepo:               voteRepo,
		completedTaskPointRepo: completedTaskPointRepo,
	}
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
	game.ActivePoll, err = g.getActivePoll(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get game active poll: %w", err)
	}

	game.CompletedTaskPoints, err = g.completedTaskPointRepo.Filter(ctx, &domain.FilterCompletedTaskPoint{GameID: &id})
	if err != nil {
		return nil, fmt.Errorf("failed to get game completed task points: %w", err)
	}

	return game, nil
}

func (g *Game) getActivePoll(ctx context.Context, gameID string) (*domain.Poll, error) {
	poll, err := repo.First(g.pollRepo)(ctx, &domain.FilterPoll{
		GameID:              &gameID,
		SortByCreatedAtDesc: true,
		Limit:               utils.PtrTo(1),
	})
	if errors.Is(err, repo.ErrNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get polls: %w", err)
	}
	poll.Votes, err = g.voteRepo.Filter(ctx, &domain.FilterVote{
		PollID: &poll.ID,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get poll votes: %w", err)
	}

	return poll, nil
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
