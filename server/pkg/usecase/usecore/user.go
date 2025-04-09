package usecore

import (
	"context"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type User struct {
	userRepo repo.User
}

func NewUser(userRepo repo.User) *User {
	return &User{userRepo: userRepo}
}

func (u *User) GetUserByID(ctx context.Context, id string) (*domain.User, error) {
	return u.userRepo.GetUserByID(ctx, id)
}
