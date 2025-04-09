package usecase

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/repo/pg"
	"github.com/shampsdev/sightquest/server/pkg/usecase/auth"
	"github.com/shampsdev/sightquest/server/pkg/usecase/game"
	"github.com/shampsdev/sightquest/server/pkg/usecase/usecore"
)

type Cases struct {
	Auth *auth.Auth
	User *usecore.User
	Game *usecore.Game

	GameHandler *game.Handler
}

func Setup(ctx context.Context, cfg *config.Config, pool *pgxpool.Pool) (*Cases, error) {
	userRepo := pg.NewUser(pool)
	gameRepo := pg.NewGame(pool, userRepo)

	auth, err := auth.NewAuther(cfg, userRepo)
	if err != nil {
		return nil, fmt.Errorf("failed to create auth: %w", err)
	}

	userCase := usecore.NewUser(userRepo)
	gameCase := usecore.NewGame(gameRepo)

	gameProvider := game.NewInMemoryGameRepo(ctx, gameCase)
	gameHandler := game.NewHandler(gameProvider, userCase, auth)

	return &Cases{
		Auth:        auth,
		User:        userCase,
		Game:        gameCase,
		GameHandler: gameHandler,
	}, nil
}
