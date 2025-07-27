package pg

import (
	"context"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRoute struct {
	psql sq.StatementBuilderType
	db   *pgxpool.Pool
}

func NewUserRoute(db *pgxpool.Pool) *UserRoute {
	return &UserRoute{
		db:   db,
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (r *UserRoute) Create(ctx context.Context, userID, routeID string) error {
	q := `INSERT INTO "user_route" (user_id, route_id) VALUES ($1, $2)`
	_, err := r.db.Exec(ctx, q, userID, routeID)
	return err
}

func (r *UserRoute) Delete(ctx context.Context, userID, routeID string) error {
	q := `DELETE FROM "user_route" WHERE user_id = $1 AND route_id = $2`
	_, err := r.db.Exec(ctx, q, userID, routeID)
	return err
}

func (r *UserRoute) Exists(ctx context.Context, userID, routeID string) (bool, error) {
	q := `SELECT EXISTS(SELECT 1 FROM "user_route" WHERE user_id = $1 AND route_id = $2)`
	var exists bool
	err := r.db.QueryRow(ctx, q, userID, routeID).Scan(&exists)
	return exists, err
}
