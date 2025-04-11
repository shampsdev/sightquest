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

func (p *Player) CreatePlayer(ctx context.Context, player *domain.Player) error {
	return p.playerRepo.CreatePlayer(ctx, player)
}

func (p *Player) UpdatePlayer(ctx context.Context, player *domain.Player) error {
	return p.playerRepo.UpdatePlayer(ctx, player)
}

func (p *Player) GetPlayer(ctx context.Context, gameID, userID string) (*domain.Player, error) {
	return p.playerRepo.GetPlayer(ctx, gameID, userID)
}

func (p *Player) GetPlayersByGameID(ctx context.Context, gameID string) ([]*domain.Player, error) {
	return p.playerRepo.GetPlayersByGameID(ctx, gameID)
}

func (p *Player) DeletePlayer(ctx context.Context, gameID, userID string) error {
	return p.playerRepo.DeletePlayer(ctx, gameID, userID)
}
