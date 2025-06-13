package pg

import (
	"context"

	sq "github.com/Masterminds/squirrel"
	"github.com/Vaniog/go-postgis"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

type Route struct {
	psql sq.StatementBuilderType
	db   *pgxpool.Pool
}

func NewRoute(db *pgxpool.Pool) *Route {
	return &Route{
		db:   db,
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (r *Route) Create(ctx context.Context, route *domain.CreateRoute) (string, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer func() {
		err := tx.Rollback(ctx)
		if err != nil {
			slogx.Error(ctx, "failed to rollback transaction", err)
		}
	}()

	// Create route
	q := `INSERT INTO "route" (title, description, price_roubles) VALUES ($1, $2, $3) RETURNING id`
	var routeID string
	err = tx.QueryRow(ctx, q, route.Title, route.Description, route.PriceRoubles).Scan(&routeID)
	if err != nil {
		return "", err
	}

	// Link task points to route
	for i, taskPointID := range route.TaskPointIDs {
		linkQ := `INSERT INTO "route_taskpoint" (route_id, taskpoint_id, order_index) VALUES ($1, $2, $3)`
		_, err = tx.Exec(ctx, linkQ, routeID, taskPointID, i)
		if err != nil {
			return "", err
		}
	}

	err = tx.Commit(ctx)
	if err != nil {
		return "", err
	}

	return routeID, nil
}

func (r *Route) Filter(ctx context.Context, filter *domain.FilterRoute) ([]*domain.Route, error) {
	q := r.psql.Select("r.id", "r.title", "r.description", "r.price_roubles").From(`"route" r`)
	if filter.ID != nil {
		q = q.Where(sq.Eq{"r.id": *filter.ID})
	}
	sql, args, err := q.ToSql()
	if err != nil {
		return nil, err
	}

	rows, err := r.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	routes := []*domain.Route{}
	for rows.Next() {
		var route domain.Route
		err := rows.Scan(&route.ID, &route.Title, &route.Description, &route.PriceRoubles)
		if err != nil {
			return nil, err
		}

		if filter.IncludeTaskPoints {
			taskPoints, err := r.getTaskPointsForRoute(ctx, route.ID)
			if err != nil {
				return nil, err
			}
			route.TaskPoints = taskPoints
		}

		routes = append(routes, &route)
	}
	return routes, nil
}

func (r *Route) getTaskPointsForRoute(ctx context.Context, routeID string) ([]domain.TaskPoint, error) {
	q := `
		SELECT tp.id, tp.title, tp.description, tp.task, tp.location, tp.score
		FROM "taskpoint" tp
		JOIN "route_taskpoint" rtp ON tp.id = rtp.taskpoint_id
		WHERE rtp.route_id = $1
		ORDER BY rtp.order_index
	`
	rows, err := r.db.Query(ctx, q, routeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	taskPoints := []domain.TaskPoint{}
	for rows.Next() {
		var tp domain.TaskPoint
		location := postgis.PointS{}
		err := rows.Scan(&tp.ID, &tp.Title, &tp.Description, &tp.Task, &location, &tp.Score)
		if err != nil {
			return nil, err
		}
		tp.Location = domain.FromPostgis(location)
		taskPoints = append(taskPoints, tp)
	}
	return taskPoints, nil
}

func (r *Route) Patch(ctx context.Context, id string, route *domain.PatchRoute) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer func() {
		err := tx.Rollback(ctx)
		if err != nil {
			slogx.Error(ctx, "failed to rollback transaction", err)
		}
	}()

	q := r.psql.Update(`"route"`)
	if route.Title != nil {
		q = q.Set("title", *route.Title)
	}
	if route.Description != nil {
		q = q.Set("description", *route.Description)
	}
	if route.PriceRoubles != nil {
		q = q.Set("price_roubles", *route.PriceRoubles)
	}

	q = q.Where(sq.Eq{"id": id})
	sql, args, err := q.ToSql()
	if err != nil {
		return err
	}
	_, err = tx.Exec(ctx, sql, args...)
	if err != nil {
		return err
	}

	if route.TaskPointIDs != nil {
		_, err = tx.Exec(ctx, `DELETE FROM "route_taskpoint" WHERE route_id = $1`, id)
		if err != nil {
			return err
		}

		for i, taskPointID := range *route.TaskPointIDs {
			linkQ := `INSERT INTO "route_taskpoint" (route_id, taskpoint_id, order_index) VALUES ($1, $2, $3)`
			_, err = tx.Exec(ctx, linkQ, id, taskPointID, i)
			if err != nil {
				return err
			}
		}
	}

	err = tx.Commit(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (r *Route) Delete(ctx context.Context, id string) error {
	q := r.psql.Delete(`"route"`).Where(sq.Eq{"id": id})
	sql, args, err := q.ToSql()
	if err != nil {
		return err
	}
	_, err = r.db.Exec(ctx, sql, args...)
	return err
}
