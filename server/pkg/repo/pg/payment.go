package pg

import (
	"context"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/domain"
)

type Payment struct {
	psql sq.StatementBuilderType
	db   *pgxpool.Pool
}

func NewPayment(db *pgxpool.Pool) *Payment {
	return &Payment{
		db:   db,
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (r *Payment) Create(ctx context.Context, payment *domain.Payment) error {
	q := `INSERT INTO "payment" (id, user_id, yookassa_id, type, item_id, amount_roubles, status, confirmation_url) 
		  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
	_, err := r.db.Exec(ctx, q,
		payment.ID,
		payment.UserID,
		payment.YooKassaID,
		payment.Type,
		payment.ItemID,
		payment.AmountRoubles,
		payment.Status,
		payment.ConfirmationURL,
	)
	return err
}

func (r *Payment) Patch(ctx context.Context, id string, patch *domain.PatchPayment) error {
	q := r.psql.Update(`"payment"`)

	if patch.Status != nil {
		q = q.Set("status", *patch.Status)
	}
	if patch.YooKassaID != nil {
		q = q.Set("yookassa_id", *patch.YooKassaID)
	}
	if patch.ConfirmationURL != nil {
		q = q.Set("confirmation_url", *patch.ConfirmationURL)
	}

	q = q.Where(sq.Eq{"id": id})
	sql, args, err := q.ToSql()
	if err != nil {
		return err
	}

	_, err = r.db.Exec(ctx, sql, args...)
	return err
}

func (r *Payment) Filter(ctx context.Context, filter *domain.FilterPayment) ([]*domain.Payment, error) {
	q := r.psql.Select("id", "user_id", "yookassa_id", "type", "item_id", "amount_roubles", "status", "confirmation_url", "created_at").
		From(`"payment"`)

	if filter.ID != nil {
		q = q.Where(sq.Eq{"id": *filter.ID})
	}
	if filter.UserID != nil {
		q = q.Where(sq.Eq{"user_id": *filter.UserID})
	}
	if filter.YooKassaID != nil {
		q = q.Where(sq.Eq{"yookassa_id": *filter.YooKassaID})
	}
	if filter.Type != nil {
		q = q.Where(sq.Eq{"type": *filter.Type})
	}
	if filter.ItemID != nil {
		q = q.Where(sq.Eq{"item_id": *filter.ItemID})
	}
	if filter.Status != nil {
		q = q.Where(sq.Eq{"status": *filter.Status})
	}

	if filter.SortByCreatedAtDesc {
		q = q.OrderBy("created_at DESC")
	}
	if filter.Limit != nil {
		q = q.Limit(uint64(*filter.Limit))
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

	payments := []*domain.Payment{}
	for rows.Next() {
		var p domain.Payment
		err := rows.Scan(
			&p.ID,
			&p.UserID,
			&p.YooKassaID,
			&p.Type,
			&p.ItemID,
			&p.AmountRoubles,
			&p.Status,
			&p.ConfirmationURL,
			&p.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		payments = append(payments, &p)
	}

	return payments, nil
}

func (r *Payment) Delete(ctx context.Context, id string) error {
	q := r.psql.Delete(`"payment"`).Where(sq.Eq{"id": id})
	sql, args, err := q.ToSql()
	if err != nil {
		return err
	}
	_, err = r.db.Exec(ctx, sql, args...)
	return err
}
