package usecase

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/repo/pg"
	"github.com/shampsdev/sightquest/server/pkg/usecase/auth"
)

type Cases struct {
	Auth *auth.Auth
	User *User
	Game *Game
}

func Setup(_ context.Context, cfg *config.Config, pool *pgxpool.Pool) (Cases, error) {
	ur := pg.NewUser(pool)
	gr := pg.NewGame(pool, ur)

	auth, err := auth.NewAuther(cfg, ur)
	if err != nil {
		return Cases{}, fmt.Errorf("failed to create auth: %w", err)
	}

	user := NewUser(ur)
	game := NewGame(gr)

	return Cases{
		Auth: auth,
		User: user,
		Game: game,
	}, nil
}
