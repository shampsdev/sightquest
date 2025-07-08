package pg

import (
	"context"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/domain"
)

type CompletedTaskPoint struct {
	psql sq.StatementBuilderType
	db   *pgxpool.Pool
}

func NewCompletedTaskPoint(db *pgxpool.Pool) *CompletedTaskPoint {
	return &CompletedTaskPoint{
		db:   db,
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (ctp *CompletedTaskPoint) Create(ctx context.Context, completedTaskPoint *domain.CreateCompletedTaskPoint) error {
	q := `INSERT INTO "completed_taskpoint" (player_id, game_id, point_id, photo, score) VALUES ($1, $2, $3, $4, $5)`
	_, err := ctp.db.Exec(ctx, q, completedTaskPoint.PlayerID, completedTaskPoint.GameID, completedTaskPoint.PointID, completedTaskPoint.Photo, completedTaskPoint.Score)
	if err != nil {
		return fmt.Errorf("failed to create completed task point: %w", err)
	}
	return nil
}

func (ctp *CompletedTaskPoint) Patch(ctx context.Context, playerID, gameID, pointID string, patch *domain.PatchCompletedTaskPoint) error {
	q := ctp.psql.Update(`"completed_taskpoint"`)

	if patch.Photo != nil {
		q = q.Set("photo", *patch.Photo)
	}
	if patch.Score != nil {
		q = q.Set("score", *patch.Score)
	}

	q = q.Where(sq.Eq{"player_id": playerID, "game_id": gameID, "point_id": pointID})
	sql, args, err := q.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	_, err = ctp.db.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("failed to update completed task point: %w", err)
	}
	return nil
}

func (ctp *CompletedTaskPoint) Filter(ctx context.Context, filter *domain.FilterCompletedTaskPoint) ([]*domain.CompletedTaskPoint, error) {
	q := ctp.psql.Select(
		"player_id",
		"game_id",
		"point_id",
		"created_at",
		"photo",
		"score",
	).From(`"completed_taskpoint"`)

	if filter.PlayerID != nil {
		q = q.Where(sq.Eq{"player_id": *filter.PlayerID})
	}
	if filter.GameID != nil {
		q = q.Where(sq.Eq{"game_id": *filter.GameID})
	}
	if filter.PointID != nil {
		q = q.Where(sq.Eq{"point_id": *filter.PointID})
	}

	if filter.SortByCreatedAtDesc {
		q = q.OrderBy("created_at DESC")
	}
	if filter.Limit != nil {
		q = q.Limit(uint64(*filter.Limit))
	}

	sql, args, err := q.ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build query: %w", err)
	}

	rows, err := ctp.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to filter completed task points: %w", err)
	}
	defer rows.Close()

	completedTaskPoints := []*domain.CompletedTaskPoint{}
	for rows.Next() {
		completedTaskPoint := &domain.CompletedTaskPoint{}

		err := rows.Scan(
			&completedTaskPoint.PlayerID,
			&completedTaskPoint.GameID,
			&completedTaskPoint.PointID,
			&completedTaskPoint.CreatedAt,
			&completedTaskPoint.Photo,
			&completedTaskPoint.Score,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan completed task point: %w", err)
		}

		completedTaskPoints = append(completedTaskPoints, completedTaskPoint)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating completed task point rows: %w", err)
	}

	return completedTaskPoints, nil
}

func (ctp *CompletedTaskPoint) Delete(ctx context.Context, playerID, gameID, pointID string) error {
	q := ctp.psql.Delete(`"completed_taskpoint"`).Where(sq.Eq{"player_id": playerID, "game_id": gameID, "point_id": pointID})

	sql, args, err := q.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	_, err = ctp.db.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("failed to delete completed task point: %w", err)
	}
	return nil
}
