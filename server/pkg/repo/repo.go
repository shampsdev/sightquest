package repo

import (
	"context"
	"errors"
	"io"

	"github.com/shampsdev/sightquest/server/pkg/domain"
)

var ErrUserNotFound = errors.New("user not found")

//go:generate mockgen -source=repo.go -destination=mocks/repo_mock.go -package=mocks -typed
type User interface {
	Create(ctx context.Context, user *domain.CreateUser) (string, error)
	Patch(ctx context.Context, id string, user *domain.PatchUser) error
	Filter(ctx context.Context, filter *domain.FilterUser) ([]*domain.User, error)
	Delete(ctx context.Context, id string) error

	GetPassword(ctx context.Context, userID string) (string, error)
}

type Game interface {
	Create(ctx context.Context, game *domain.CreateGame) (string, error)
	Patch(ctx context.Context, id string, game *domain.PatchGame) error
	Filter(ctx context.Context, filter *domain.FilterGame) ([]*domain.Game, error)
	Delete(ctx context.Context, id string) error
}

type Style interface {
	Create(ctx context.Context, style *domain.CreateStyle) (string, error)
	Patch(ctx context.Context, id string, style *domain.PatchStyle) error
	Filter(ctx context.Context, filter *domain.FilterStyle) ([]*domain.Style, error)
	Delete(ctx context.Context, id string) error
}

type UserStyle interface {
	Create(ctx context.Context, userID, styleID string) error
	Delete(ctx context.Context, userID, styleID string) error
	Exists(ctx context.Context, userID, styleID string) (bool, error)
}

type Player interface {
	Create(ctx context.Context, player *domain.CreatePlayer) error
	Patch(ctx context.Context, gameID, userID string, player *domain.PatchPlayer) error
	Filter(ctx context.Context, filter *domain.FilterPlayer) ([]*domain.Player, error)
	Delete(ctx context.Context, gameID, userID string) error
}

type Route interface {
	Create(ctx context.Context, route *domain.CreateRoute) (string, error)
	Patch(ctx context.Context, id string, route *domain.PatchRoute) error
	Filter(ctx context.Context, filter *domain.FilterRoute) ([]*domain.Route, error)
	Delete(ctx context.Context, id string) error
}

type UserRoute interface {
	Create(ctx context.Context, userID, routeID string) error
	Delete(ctx context.Context, userID, routeID string) error
	Exists(ctx context.Context, userID, routeID string) (bool, error)
}

type TaskPoint interface {
	Create(ctx context.Context, taskPoint *domain.CreateTaskPoint) (string, error)
	Patch(ctx context.Context, id string, taskPoint *domain.PatchTaskPoint) error
	Filter(ctx context.Context, filter *domain.FilterTaskPoint) ([]*domain.TaskPoint, error)
	Delete(ctx context.Context, id string) error
}

type Poll interface {
	Create(ctx context.Context, poll *domain.CreatePoll) (string, error)
	Patch(ctx context.Context, id string, poll *domain.PatchPoll) error
	Filter(ctx context.Context, filter *domain.FilterPoll) ([]*domain.Poll, error)
	Delete(ctx context.Context, id string) error
}

type Vote interface {
	Create(ctx context.Context, vote *domain.CreateVote) error
	Patch(ctx context.Context, pollID, playerID string, vote *domain.PatchVote) error
	Filter(ctx context.Context, filter *domain.FilterVote) ([]*domain.Vote, error)
	Delete(ctx context.Context, pollID, playerID string) error
}

type CompletedTaskPoint interface {
	Create(ctx context.Context, completedTaskPoint *domain.CreateCompletedTaskPoint) error
	Patch(ctx context.Context, playerID, gameID, pointID string, completedTaskPoint *domain.PatchCompletedTaskPoint) error
	Filter(ctx context.Context, filter *domain.FilterCompletedTaskPoint) ([]*domain.CompletedTaskPoint, error)
	Delete(ctx context.Context, playerID, gameID, pointID string) error
}

type Payment interface {
	Create(ctx context.Context, payment *domain.Payment) error
	Patch(ctx context.Context, id string, patch *domain.PatchPayment) error
	Filter(ctx context.Context, filter *domain.FilterPayment) ([]*domain.Payment, error)
	Delete(ctx context.Context, id string) error
}

type ImageStorage interface {
	SaveImageByReader(ctx context.Context, imageData io.Reader, destDir string) (string, error)
}
