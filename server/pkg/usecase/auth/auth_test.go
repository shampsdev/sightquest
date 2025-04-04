package auth

import (
	"context"
	"testing"

	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	repomocks "github.com/shampsdev/sightquest/server/pkg/repo/mocks"
	"github.com/stretchr/testify/assert"
	"go.uber.org/mock/gomock"
)

func TestRegister(t *testing.T) {
	cfg := &config.Config{}

	cfg.Auth.PasswordSecret = "0123456789abcdef0123456789abcdef"
	cfg.Auth.JWTSecret = "secret"

	ctrl := gomock.NewController(t)
	userRepo := repomocks.NewMockUser(ctrl)
	a, err := NewAuther(cfg, userRepo)
	assert.NoError(t, err)
	ctx := t.Context()

	// Register
	var password string
	userRepo.EXPECT().CreateUser(gomock.Any(), &domain.CreateUser{Username: "shamp", Email: "shamp@mail.ru"}, gomock.Any()).
		DoAndReturn(func(_ context.Context, _ *domain.CreateUser, pass string) (string, error) {
			password = pass
			return "user1", nil
		}).Times(1)

	token, err := a.Register(ctx, &domain.UserCredentials{Username: "shamp", Email: "shamp@mail.ru", Password: "password"})
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	// Auth by token
	userID, err := a.ParseToken(token)
	assert.NoError(t, err)
	assert.Equal(t, "user1", userID)

	// Auth by username + password
	userRepo.EXPECT().GetUserByUsername(gomock.Any(), "shamp").Times(1).Return(&domain.User{ID: "user1"}, nil)
	userRepo.EXPECT().GetUserPassword(gomock.Any(), "user1").Times(1).Return(password, nil)

	token, err = a.Login(ctx, &domain.UserCredentials{Username: "shamp", Password: "password"})
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	// Auth by email + password
	userRepo.EXPECT().GetUserByEmail(gomock.Any(), "shamp@mail.ru").Times(1).Return(&domain.User{ID: "user1"}, nil)
	userRepo.EXPECT().GetUserPassword(gomock.Any(), "user1").Times(1).Return(password, nil)

	token, err = a.Login(ctx, &domain.UserCredentials{Email: "shamp@mail.ru", Password: "password"})
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	// Wrong password
	userRepo.EXPECT().GetUserByUsername(gomock.Any(), "shamp").Times(1).Return(&domain.User{ID: "user1"}, nil)
	userRepo.EXPECT().GetUserPassword(gomock.Any(), "user1").Times(1).Return(password, nil)

	_, err = a.Login(ctx, &domain.UserCredentials{Username: "shamp", Password: "wrong"})
	assert.Error(t, err)

	// Wrong token
	_, err = a.ParseToken("wrong")
	assert.Error(t, err)
}
