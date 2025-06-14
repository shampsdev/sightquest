package usecore

import (
	"context"
	"fmt"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type Style struct {
	styleRepo     repo.Style
	userStyleRepo repo.UserStyle
	userRepo      repo.User
}

func NewStyle(styleRepo repo.Style, userStyleRepo repo.UserStyle, userRepo repo.User) *Style {
	return &Style{
		styleRepo:     styleRepo,
		userStyleRepo: userStyleRepo,
		userRepo:      userRepo,
	}
}

func (s *Style) BuyStyle(ctx *Context, styleID string) error {
	_, err := repo.First(s.styleRepo)(ctx, &domain.FilterStyle{ID: &styleID})
	if err != nil {
		return fmt.Errorf("failed to get style: %w", err)
	}

	err = s.userStyleRepo.Create(ctx, ctx.UserID, styleID)
	if err != nil {
		return fmt.Errorf("failed to add style to user: %w", err)
	}

	return nil
}

func (s *Style) GetStyles(ctx context.Context, filter *domain.FilterStyle) ([]*domain.Style, error) {
	return s.styleRepo.Filter(ctx, filter)
}

func (s *Style) SetAvatar(ctx *Context, styleID string) error {
	style, err := repo.First(s.styleRepo)(ctx, &domain.FilterStyle{ID: &styleID})
	if err != nil {
		return fmt.Errorf("style not found: %w", err)
	}

	if style.PriceRoubles != 0 {
		// Verify user owns the style
		exists, err := s.userStyleRepo.Exists(ctx, ctx.UserID, styleID)
		if err != nil {
			return fmt.Errorf("failed to check user style: %w", err)
		}
		if !exists {
			return fmt.Errorf("user doesn't own this style")
		}
	}

	user, err := repo.First(s.userRepo)(ctx, &domain.FilterUser{ID: &ctx.UserID})
	if err != nil {
		return fmt.Errorf("failed to get user: %w", err)
	}
	styles := user.Styles
	styles.AvatarID = styleID

	err = s.userRepo.Patch(ctx, ctx.UserID, &domain.PatchUser{
		UserStyles: &styles,
	})
	if err != nil {
		return fmt.Errorf("failed to update user avatar: %w", err)
	}

	return nil
}
