package usecore

import (
	"context"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type Player struct {
	playerRepo repo.Player
}

func NewPlayer(playerRepo repo.Player) *Player {
	return &Player{
		playerRepo: playerRepo,
	}
}

func (p *Player) CreatePlayer(ctx context.Context, player *domain.CreatePlayer) (*domain.Player, error) {
	err := p.playerRepo.Create(ctx, player)
	if err != nil {
		return nil, err
	}

	return p.GetPlayer(ctx, player.GameID, player.UserID)
}

func (p *Player) UpdatePlayer(ctx context.Context, gameID, userID string, patch *domain.PatchPlayer) error {
	return p.playerRepo.Patch(ctx, gameID, userID, patch)
}

func (p *Player) GetPlayer(ctx context.Context, gameID, userID string) (*domain.Player, error) {
	return repo.First(p.playerRepo)(ctx, &domain.FilterPlayer{GameID: &gameID, UserID: &userID})
}

func (p *Player) GetPlayersByGameID(ctx context.Context, gameID string) ([]*domain.Player, error) {
	return p.playerRepo.Filter(ctx, &domain.FilterPlayer{GameID: &gameID})
}

func (p *Player) DeletePlayer(ctx context.Context, gameID, userID string) error {
	return p.playerRepo.Delete(ctx, gameID, userID)
}
