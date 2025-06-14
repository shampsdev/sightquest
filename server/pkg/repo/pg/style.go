package pg

import (
	"context"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/domain"
)

type Style struct {
	psql sq.StatementBuilderType
	db   *pgxpool.Pool
}

func NewStyle(db *pgxpool.Pool) *Style {
	return &Style{
		db:   db,
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (r *Style) Create(ctx context.Context, style *domain.CreateStyle) (string, error) {
	q := `INSERT INTO "style" (price_roubles, title, style) VALUES ($1, $2, $3) RETURNING id`
	var id string
	err := r.db.QueryRow(ctx, q, style.PriceRoubles, style.Title, style.Style).Scan(&id)
	if err != nil {
		return "", err
	}
	return id, nil
}

func (r *Style) Patch(ctx context.Context, id string, style *domain.PatchStyle) error {
	q := r.psql.Update(`"style"`)
	if style.PriceRoubles != nil {
		q = q.Set("price_roubles", *style.PriceRoubles)
	}
	if style.Title != nil {
		q = q.Set("title", *style.Title)
	}
	if style.Style != nil {
		q = q.Set("style", *style.Style)
	}
	if style.Type != nil {
		q = q.Set("type", *style.Type)
	}

	q = q.Where(sq.Eq{"id": id})
	sql, args, err := q.ToSql()
	if err != nil {
		return err
	}

	_, err = r.db.Exec(ctx, sql, args...)
	return err
}

func (r *Style) Filter(ctx context.Context, filter *domain.FilterStyle) ([]*domain.Style, error) {
	q := r.psql.Select("id", "price_roubles", "title", "style", "type").
		From(`"style"`)

	if filter.ID != nil {
		q = q.Where(sq.Eq{"id": *filter.ID})
	}
	if filter.PriceRoubles != nil {
		q = q.Where(sq.Eq{"price_roubles": *filter.PriceRoubles})
	}
	if filter.Type != nil {
		q = q.Where(sq.Eq{"type": *filter.Type})
	}
	if filter.UserID != nil {
		q = q.Join(`"user_style" us ON us.style_id = "style".id`)
		q = q.Where(sq.Eq{"us.user_id": *filter.UserID})
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

	styles := []*domain.Style{}
	for rows.Next() {
		var s domain.Style
		if err := rows.Scan(&s.ID, &s.PriceRoubles, &s.Title, &s.Style, &s.Type); err != nil {
			return nil, err
		}
		styles = append(styles, &s)
	}

	return styles, nil
}

func (r *Style) Delete(ctx context.Context, id string) error {
	q := r.psql.Delete(`"style"`).Where(sq.Eq{"id": id})
	sql, args, err := q.ToSql()
	if err != nil {
		return err
	}
	_, err = r.db.Exec(ctx, sql, args...)
	return err
}
