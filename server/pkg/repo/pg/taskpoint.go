package pg

import (
	"context"

	sq "github.com/Masterminds/squirrel"
	"github.com/Vaniog/go-postgis"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/domain"
)

type TaskPoint struct {
	psql sq.StatementBuilderType
	db   *pgxpool.Pool
}

func NewTaskPoint(db *pgxpool.Pool) *TaskPoint {
	return &TaskPoint{
		db:   db,
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (tp *TaskPoint) Create(ctx context.Context, taskPoint *domain.CreateTaskPoint) (string, error) {
	q := `INSERT INTO "taskpoint" (title, description, task, location, score) VALUES ($1, $2, $3, GeomFromEWKB($4), $5) RETURNING id`
	var id string
	err := tp.db.QueryRow(ctx, q, taskPoint.Title, taskPoint.Description, taskPoint.Task, taskPoint.Location.ToPostgis(), taskPoint.Score).Scan(&id)
	return id, err
}

func (tp *TaskPoint) Filter(ctx context.Context, filter *domain.FilterTaskPoint) ([]*domain.TaskPoint, error) {
	q := tp.psql.Select("tp.id", "tp.title", "tp.description", "tp.task", "tp.location", "tp.score").From(`"taskpoint" tp`)

	if filter.ID != nil {
		q = q.Where(sq.Eq{"tp.id": *filter.ID})
	}
	if filter.RouteID != nil {
		q = q.Join(`"route_taskpoint" rtp ON tp.id = rtp.taskpoint_id`)
		q = q.Where(sq.Eq{"rtp.route_id": *filter.RouteID})
		q = q.OrderBy("rtp.order_index")
	}

	sql, args, err := q.ToSql()
	if err != nil {
		return nil, err
	}

	rows, err := tp.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var taskPoints []*domain.TaskPoint
	for rows.Next() {
		var taskPoint domain.TaskPoint
		var location postgis.PointS
		err := rows.Scan(&taskPoint.ID, &taskPoint.Title, &taskPoint.Description, &taskPoint.Task, &location, &taskPoint.Score)
		if err != nil {
			return nil, err
		}
		taskPoint.Location = domain.FromPostgis(location)
		taskPoints = append(taskPoints, &taskPoint)
	}
	return taskPoints, nil
}

func (tp *TaskPoint) Patch(ctx context.Context, id string, taskPoint *domain.PatchTaskPoint) error {
	q := tp.psql.Update(`"taskpoint"`)

	if taskPoint.Title != nil {
		q = q.Set("title", *taskPoint.Title)
	}
	if taskPoint.Description != nil {
		q = q.Set("description", *taskPoint.Description)
	}
	if taskPoint.Task != nil {
		q = q.Set("task", *taskPoint.Task)
	}
	if taskPoint.Location != nil {
		q = q.Set("location", sq.Expr("GeomFromEWKB(?)", taskPoint.Location.ToPostgis()))
	}
	if taskPoint.Score != nil {
		q = q.Set("score", *taskPoint.Score)
	}

	q = q.Where(sq.Eq{"id": id})
	sql, args, err := q.ToSql()
	if err != nil {
		return err
	}
	_, err = tp.db.Exec(ctx, sql, args...)
	return err
}

func (tp *TaskPoint) Delete(ctx context.Context, id string) error {
	q := tp.psql.Delete(`"taskpoint"`).Where(sq.Eq{"id": id})
	sql, args, err := q.ToSql()
	if err != nil {
		return err
	}
	_, err = tp.db.Exec(ctx, sql, args...)
	return err
}
