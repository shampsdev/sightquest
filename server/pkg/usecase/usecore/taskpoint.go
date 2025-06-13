package usecore

import (
	"context"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type TaskPoint struct {
	taskPointRepo repo.TaskPoint
}

func NewTaskPoint(taskPointRepo repo.TaskPoint) *TaskPoint {
	return &TaskPoint{taskPointRepo: taskPointRepo}
}

func (tp *TaskPoint) GetTaskPointByID(ctx context.Context, id string) (*domain.TaskPoint, error) {
	return repo.First(tp.taskPointRepo)(ctx, &domain.FilterTaskPoint{ID: &id})
}

func (tp *TaskPoint) GetTaskPoints(ctx context.Context, filter *domain.FilterTaskPoint) ([]*domain.TaskPoint, error) {
	return tp.taskPointRepo.Filter(ctx, filter)
}

func (tp *TaskPoint) GetTaskPointsByRouteID(ctx context.Context, routeID string) ([]*domain.TaskPoint, error) {
	return tp.taskPointRepo.Filter(ctx, &domain.FilterTaskPoint{RouteID: &routeID})
}
