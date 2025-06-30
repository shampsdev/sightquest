package pg

import (
	"context"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/domain"
)

type Vote struct {
	psql sq.StatementBuilderType
	db   *pgxpool.Pool
}

func NewVote(db *pgxpool.Pool) *Vote {
	return &Vote{
		db:   db,
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (v *Vote) Create(ctx context.Context, vote *domain.CreateVote) error {
	q := `INSERT INTO "vote" (poll_id, player_id, game_id, type, data) VALUES ($1, $2, $3, $4, $5)`
	_, err := v.db.Exec(ctx, q, vote.PollID, vote.PlayerID, vote.GameID, vote.Type, vote.Data)
	if err != nil {
		return fmt.Errorf("failed to create vote: %w", err)
	}
	return nil
}

func (v *Vote) Patch(ctx context.Context, pollID, playerID string, patch *domain.PatchVote) error {
	q := v.psql.Update(`"vote"`)

	if patch.Type != nil {
		q = q.Set("type", *patch.Type)
	}
	if patch.Data != nil {
		q = q.Set("vote", *patch.Data)
	}

	q = q.Where(sq.Eq{"poll_id": pollID, "player_id": playerID})
	sql, args, err := q.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	_, err = v.db.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("failed to update vote: %w", err)
	}
	return nil
}

func (v *Vote) Filter(ctx context.Context, filter *domain.FilterVote) ([]*domain.Vote, error) {
	q := v.psql.Select(
		"poll_id",
		"player_id",
		"game_id",
		"type",
		"data",
		"created_at",
	).From(`"vote"`)

	if filter.PollID != nil {
		q = q.Where(sq.Eq{"poll_id": *filter.PollID})
	}
	if filter.PlayerID != nil {
		q = q.Where(sq.Eq{"player_id": *filter.PlayerID})
	}
	if filter.GameID != nil {
		q = q.Where(sq.Eq{"game_id": *filter.GameID})
	}
	if filter.Type != nil {
		q = q.Where(sq.Eq{"type": *filter.Type})
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

	rows, err := v.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to filter votes: %w", err)
	}
	defer rows.Close()

	var votes []*domain.Vote
	for rows.Next() {
		vote := &domain.Vote{}

		err := rows.Scan(
			&vote.PollID,
			&vote.PlayerID,
			&vote.GameID,
			&vote.Type,
			&vote.Data,
			&vote.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan vote: %w", err)
		}

		votes = append(votes, vote)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating vote rows: %w", err)
	}

	return votes, nil
}

func (v *Vote) Delete(ctx context.Context, pollID, playerID string) error {
	q := v.psql.Delete(`"vote"`).Where(sq.Eq{"poll_id": pollID, "player_id": playerID})

	sql, args, err := q.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	_, err = v.db.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("failed to delete vote: %w", err)
	}
	return nil
}
