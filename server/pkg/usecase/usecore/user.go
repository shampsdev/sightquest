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

func (u *User) PatchUser(c *Context, patchUser *domain.PatchUser) (*domain.User, error) {
	err := u.userRepo.PatchUser(c, c.UserID, patchUser)
	if err != nil {
		return nil, err
	}
	return u.GetUserByID(c, c.UserID)
}
