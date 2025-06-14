package auth

import (
	"context"
	"testing"

	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	repomocks "github.com/shampsdev/sightquest/server/pkg/repo/mocks"
	"github.com/shampsdev/sightquest/server/pkg/utils"
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
	userRepo.EXPECT().Create(gomock.Any(), gomock.Any()).
		DoAndReturn(func(_ context.Context, cu *domain.CreateUser) (string, error) {
			password = cu.Password
			assert.Equal(t, "shamp", cu.Username)
			return "user1", nil
		}).Times(1)

	token, err := a.Register(ctx, &domain.CreateUser{UserCredentials: domain.UserCredentials{
		Username: "shamp",
		Email:    "shamp@mail.ru",
		Password: "password",
	}})
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	// Auth by token
	userID, err := a.ParseToken(token)
	assert.NoError(t, err)
	assert.Equal(t, "user1", userID)

	// Auth by username + password
	userRepo.EXPECT().Filter(gomock.Any(), &domain.FilterUser{Username: utils.PtrTo("shamp")}).Times(1).Return([]*domain.User{{ID: "user1"}}, nil)
	userRepo.EXPECT().GetPassword(gomock.Any(), "user1").Times(1).Return(password, nil)

	token, err = a.Login(ctx, &domain.UserCredentials{Username: "shamp", Password: "password"})
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	// Auth by email + password
	userRepo.EXPECT().Filter(gomock.Any(), &domain.FilterUser{Email: utils.PtrTo("shamp@mail.ru")}).Times(1).Return([]*domain.User{{ID: "user1"}}, nil)
	userRepo.EXPECT().GetPassword(gomock.Any(), "user1").Times(1).Return(password, nil)

	token, err = a.Login(ctx, &domain.UserCredentials{Email: "shamp@mail.ru", Password: "password"})
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	// Wrong password
	userRepo.EXPECT().Filter(gomock.Any(), &domain.FilterUser{Username: utils.PtrTo("shamp")}).Times(1).Return([]*domain.User{{ID: "user1"}}, nil)
	userRepo.EXPECT().GetPassword(gomock.Any(), "user1").Times(1).Return(password, nil)

	_, err = a.Login(ctx, &domain.UserCredentials{Username: "shamp", Password: "wrong"})
	assert.Error(t, err)

	// Wrong token
	_, err = a.ParseToken("wrong")
	assert.Error(t, err)
}

func TestCompatibility(t *testing.T) {
	cfg := &config.Config{}
	cfg.Auth.PasswordSecret = "0123456789abcdef0123456789abcdef"
	password := "WjyCxAlFRP1Xlj45bh3wuWEQZjj63ovoF3absCQKD3niEhCSPFyKwmgpQjgW+19gzlKa4B2XXHNVjigddpgvStIEZiLHpa+bT0T5NFOuv15+fXauOIB0uzEseEGrpBoi0lKiy/H4GpLDsmz/NUyxCHxS5n570kiuP+7EFok="

	ctrl := gomock.NewController(t)
	userRepo := repomocks.NewMockUser(ctrl)
	a, err := NewAuther(cfg, userRepo)
	assert.NoError(t, err)

	userRepo.EXPECT().Filter(gomock.Any(), &domain.FilterUser{Username: utils.PtrTo("user1")}).Return([]*domain.User{{ID: "user1"}}, nil).Times(1)
	userRepo.EXPECT().GetPassword(gomock.Any(), "user1").Return(password, nil).Times(1)

	token, err := a.Login(t.Context(), &domain.UserCredentials{Username: "user1", Password: "1234"})
	assert.NoError(t, err)
	userID, err := a.ParseToken(token)
	assert.NoError(t, err)
	assert.Equal(t, "user1", userID)
}
