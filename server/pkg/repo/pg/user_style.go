package pg

import (
	"context"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserStyle struct {
	psql sq.StatementBuilderType
	db   *pgxpool.Pool
}

func NewUserStyle(db *pgxpool.Pool) *UserStyle {
	return &UserStyle{
		db:   db,
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (r *UserStyle) Create(ctx context.Context, userID, styleID string) error {
	q := `INSERT INTO "user_style" (user_id, style_id) VALUES ($1, $2)`
	_, err := r.db.Exec(ctx, q, userID, styleID)
	return err
}

func (r *UserStyle) Delete(ctx context.Context, userID, styleID string) error {
	q := `DELETE FROM "user_style" WHERE user_id = $1 AND style_id = $2`
	_, err := r.db.Exec(ctx, q, userID, styleID)
	return err
}

func (r *UserStyle) Exists(ctx context.Context, userID, styleID string) (bool, error) {
	q := `SELECT EXISTS(SELECT 1 FROM "user_style" WHERE user_id = $1 AND style_id = $2)`
	var exists bool
	err := r.db.QueryRow(ctx, q, userID, styleID).Scan(&exists)
	return exists, err
}
