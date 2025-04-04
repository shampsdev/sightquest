package auth

import (
	"context"
	"fmt"

	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type Auth struct {
	params    *argonParams
	jwtSigner *jwtSigner

	userRepo repo.User
}

func NewAuther(cfg *config.Config, userRepo repo.User) (*Auth, error) {
	a := &Auth{
		params:   defaultArgonParams,
		userRepo: userRepo,
	}

	a.jwtSigner = newJWTSigner(cfg.Auth.JWTSecret)

	return a, nil
}

func (a *Auth) Register(ctx context.Context, creds *domain.UserCredentials) (string, error) {
	hash, err := a.hashPassword(creds.Password)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}

	user := &domain.CreateUser{
		Username: creds.Username,
		Email:    creds.Email,
	}

	id, err := a.userRepo.CreateUser(ctx, user, hash)
	if err != nil {
		return "", fmt.Errorf("failed to create user: %w", err)
	}

	token, err := a.jwtSigner.GenerateToken(id)
	if err != nil {
		return "", fmt.Errorf("failed to generate token: %w", err)
	}

	return token, nil
}

func (a *Auth) Login(ctx context.Context, creds *domain.UserCredentials) (string, error) {
	var user *domain.User
	var err error

	if creds.Username != "" {
		user, err = a.userRepo.GetUserByUsername(ctx, creds.Username)
		if err != nil {
			return "", fmt.Errorf("failed to get user: %w", err)
		}
	} else if creds.Email != "" {
		user, err = a.userRepo.GetUserByEmail(ctx, creds.Email)
		if err != nil {
			return "", fmt.Errorf("failed to get user: %w", err)
		}
	} else {
		return "", fmt.Errorf("either username or email must be provided")
	}

	hash, err := a.userRepo.GetUserPassword(ctx, user.ID)
	if err != nil {
		return "", fmt.Errorf("failed to get user password: %w", err)
	}

	ok, err := a.checkPasswordHash(creds.Password, hash)
	if err != nil {
		return "", fmt.Errorf("failed to check password hash: %w", err)
	}

	if !ok {
		return "", fmt.Errorf("invalid password")
	}

	token, err := a.jwtSigner.GenerateToken(user.ID)
	if err != nil {
		return "", fmt.Errorf("failed to generate token: %w", err)
	}

	return token, nil
}

func (a *Auth) ParseToken(token string) (string, error) {
	userID, err := a.jwtSigner.ParseToken(token)
	if err != nil {
		return "", fmt.Errorf("failed to verify token: %w", err)
	}
	return userID, nil
}

func (a *Auth) hashPassword(password string) (string, error) {
	hash, err := generateFromPassword(password, defaultArgonParams)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}

	return hash, nil
}

func (a *Auth) checkPasswordHash(password, encodedHash string) (bool, error) {
	return comparePasswordAndHash(password, encodedHash)
}
