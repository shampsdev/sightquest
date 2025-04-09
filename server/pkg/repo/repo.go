package repo

import (
	"context"
	"errors"

	"github.com/shampsdev/sightquest/server/pkg/domain"
)

var ErrUserNotFound = errors.New("user not found")

//go:generate mockgen -source=repo.go -destination=mocks/repo_mock.go -package=mocks -typed
type User interface {
	CreateUser(ctx context.Context, user *domain.CreateUser, password string) (string, error)
	GetUserByUsername(ctx context.Context, userID string) (*domain.User, error)
	GetUserByID(ctx context.Context, userID string) (*domain.User, error)
	GetUserByEmail(ctx context.Context, userID string) (*domain.User, error)
	GetUserPassword(ctx context.Context, userID string) (string, error)
}

type Game interface {
	CreateGame(ctx context.Context, game *domain.CreateGame) (string, error)
	GetGameByID(ctx context.Context, gameID string) (*domain.Game, error)
}
