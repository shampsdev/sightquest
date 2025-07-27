package usecore

import (
	"context"
	"fmt"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
	"github.com/shampsdev/sightquest/server/pkg/utils"
)

type Route struct {
	routeRepo     repo.Route
	userRouteRepo repo.UserRoute
}

func NewRoute(routeRepo repo.Route, userRouteRepo repo.UserRoute) *Route {
	return &Route{routeRepo: routeRepo, userRouteRepo: userRouteRepo}
}

func (r *Route) CreateRoute(ctx context.Context, createRoute *domain.CreateRoute) (*domain.Route, error) {
	id, err := r.routeRepo.Create(ctx, createRoute)
	if err != nil {
		return nil, err
	}
	return r.GetRouteByID(ctx, id)
}

func (r *Route) GetRouteByID(ctx context.Context, id string) (*domain.Route, error) {
	return repo.First(r.routeRepo)(ctx, &domain.FilterRoute{ID: &id, IncludeTaskPoints: true})
}

func (r *Route) BuyRoute(ctx *Context, routeID string) error {
	_, err := repo.First(r.routeRepo)(ctx, &domain.FilterRoute{ID: &routeID})
	if err != nil {
		return fmt.Errorf("failed to get style: %w", err)
	}

	err = r.userRouteRepo.Create(ctx, ctx.UserID, routeID)
	if err != nil {
		return fmt.Errorf("failed to add style to user: %w", err)
	}

	return nil
}

func (r *Route) EnsureRouteBought(ctx context.Context, userID, routeID string) error {
	_, err := repo.First(r.routeRepo)(ctx, &domain.FilterRoute{
		ID:     &routeID,
		UserID: &userID,
		Bought: utils.PtrTo(true),
	})
	return err
}

func (r *Route) GetRoutes(ctx context.Context, filter *domain.FilterRoute) ([]*domain.Route, error) {
	return r.routeRepo.Filter(ctx, filter)
}

func (r *Route) PatchRoute(ctx context.Context, id string, patchRoute *domain.PatchRoute) (*domain.Route, error) {
	err := r.routeRepo.Patch(ctx, id, patchRoute)
	if err != nil {
		return nil, err
	}
	return r.GetRouteByID(ctx, id)
}

func (r *Route) DeleteRoute(ctx context.Context, id string) error {
	return r.routeRepo.Delete(ctx, id)
}
