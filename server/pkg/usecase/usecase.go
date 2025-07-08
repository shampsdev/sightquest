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
	Auth      *auth.Auth
	User      *usecore.User
	Game      *usecore.Game
	Player    *usecore.Player
	Route     *usecore.Route
	TaskPoint *usecore.TaskPoint
	Style     *usecore.Style

	GameHandler *game.Handler
}

func Setup(ctx context.Context, cfg *config.Config, pool *pgxpool.Pool) (*Cases, error) {
	userRepo := pg.NewUser(pool)
	playerRepo := pg.NewPlayer(pool, userRepo)
	routeRepo := pg.NewRoute(pool)
	taskPointRepo := pg.NewTaskPoint(pool)
	gameRepo := pg.NewGame(pool, userRepo, routeRepo)
	styleRepo := pg.NewStyle(pool)
	userStyleRepo := pg.NewUserStyle(pool)
	voteRepo := pg.NewVote(pool)
	completedTaskPointRepo := pg.NewCompletedTaskPoint(pool)
	pollRepo := pg.NewPoll(pool, voteRepo)

	auth, err := auth.NewAuther(cfg, userRepo)
	if err != nil {
		return nil, fmt.Errorf("failed to create auth: %w", err)
	}

	userCase := usecore.NewUser(userRepo)
	playerCase := usecore.NewPlayer(playerRepo)
	routeCase := usecore.NewRoute(routeRepo)
	taskPointCase := usecore.NewTaskPoint(taskPointRepo)
	gameCase := usecore.NewGame(gameRepo, playerRepo, pollRepo, voteRepo, completedTaskPointRepo)

	gameProvider := game.NewInMemoryGameRepo(ctx, gameCase, playerCase, routeCase, pollRepo, voteRepo, completedTaskPointRepo)
	gameHandler := game.NewHandler(gameProvider, userCase, auth)
	styleCase := usecore.NewStyle(styleRepo, userStyleRepo, userRepo)

	return &Cases{
		Auth:        auth,
		User:        userCase,
		Game:        gameCase,
		Player:      playerCase,
		Route:       routeCase,
		TaskPoint:   taskPointCase,
		Style:       styleCase,
		GameHandler: gameHandler,
	}, nil
}
