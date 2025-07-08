package pg

import (
	"context"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/domain"
)

type Poll struct {
	psql sq.StatementBuilderType
	db   *pgxpool.Pool
	vr   *Vote
}

func NewPoll(db *pgxpool.Pool, vr *Vote) *Poll {
	return &Poll{
		db:   db,
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
		vr:   vr,
	}
}

func (p *Poll) Create(ctx context.Context, poll *domain.CreatePoll) (string, error) {
	q := `INSERT INTO "poll" (type, state, duration, data, game_id, finished_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
	var id string
	err := p.db.QueryRow(ctx, q, poll.Type, poll.State, poll.Duration, poll.Data, poll.GameID, nil).Scan(&id)
	if err != nil {
		return "", fmt.Errorf("failed to create poll: %w", err)
	}
	return id, nil
}

func (p *Poll) Patch(ctx context.Context, id string, patch *domain.PatchPoll) error {
	q := p.psql.Update(`"poll"`)

	if patch.Type != nil {
		q = q.Set("type", *patch.Type)
	}
	if patch.Duration != nil {
		q = q.Set("duration", *patch.Duration)
	}
	if patch.Data != nil {
		q = q.Set("data", *patch.Data)
	}
	if patch.Result != nil {
		q = q.Set("result", *patch.Result)
	}
	if patch.State != nil {
		q = q.Set("state", *patch.State)
	}
	if patch.FinishedAt != nil {
		q = q.Set("finished_at", *patch.FinishedAt)
	}

	q = q.Where(sq.Eq{"id": id})
	sql, args, err := q.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	_, err = p.db.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("failed to update poll: %w", err)
	}
	return nil
}

func (p *Poll) Filter(ctx context.Context, filter *domain.FilterPoll) ([]*domain.Poll, error) {
	q := p.psql.Select(
		"id",
		"type",
		"state",
		"created_at",
		"duration",
		"data",
		"result",
		"game_id",
		"finished_at",
	).From(`"poll"`)

	if filter.ID != nil {
		q = q.Where(sq.Eq{"id": *filter.ID})
	}
	if filter.Type != nil {
		q = q.Where(sq.Eq{"type": *filter.Type})
	}
	if filter.GameID != nil {
		q = q.Where(sq.Eq{"game_id": *filter.GameID})
	}
	if filter.State != nil {
		q = q.Where(sq.Eq{"state": *filter.State})
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

	rows, err := p.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to filter polls: %w", err)
	}
	defer rows.Close()

	var polls []*domain.Poll
	for rows.Next() {
		poll := &domain.Poll{}

		err := rows.Scan(
			&poll.ID,
			&poll.Type,
			&poll.State,
			&poll.CreatedAt,
			&poll.Duration,
			&poll.Data,
			&poll.Result,
			&poll.GameID,
			&poll.FinishedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan poll: %w", err)
		}

		if filter.IncludeVotes {
			votes, err := p.vr.Filter(ctx, &domain.FilterVote{PollID: &poll.ID})
			if err != nil {
				return nil, fmt.Errorf("failed to get votes: %w", err)
			}
			poll.Votes = votes
		}

		polls = append(polls, poll)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating poll rows: %w", err)
	}

	return polls, nil
}

func (p *Poll) Delete(ctx context.Context, id string) error {
	q := p.psql.Delete(`"poll"`).Where(sq.Eq{"id": id})

	sql, args, err := q.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	_, err = p.db.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("failed to delete poll: %w", err)
	}
	return nil
}
