package usecase

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/config"
)

type Cases struct{}

func Setup(ctx context.Context, cfg *config.Config, pool *pgxpool.Pool) Cases {
	return Cases{}
}
