package pg

import (
	"context"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/Vaniog/go-postgis"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type Player struct {
	psql     sq.StatementBuilderType
	db       *pgxpool.Pool
	userRepo repo.User
}

func NewPlayer(db *pgxpool.Pool, userRepo repo.User) *Player {
	return &Player{
		db:       db,
		userRepo: userRepo,
		psql:     sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (p *Player) Create(ctx context.Context, player *domain.CreatePlayer) error {
	q := p.psql.Insert(`"player"`).
		Columns("game_id", "user_id", "role", "score", "location").
		Values(player.GameID, player.UserID, player.Role, player.Score, sq.Expr("GeomFromEWKB(?)", player.Location.ToPostgis()))

	sql, args, err := q.ToSql()
	if err != nil {
		return fmt.Errorf("error building query: %w", err)
	}

	_, err = p.db.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("error creating player: %w", err)
	}
	return nil
}

func (p *Player) Patch(ctx context.Context, gameID, userID string, patch *domain.PatchPlayer) error {
	q := p.psql.Update(`"player"`)

	if patch.Role != nil {
		q = q.Set("role", *patch.Role)
	}
	if patch.Score != nil {
		q = q.Set("score", *patch.Score)
	}
	if patch.Location != nil {
		q = q.Set("location", sq.Expr("GeomFromEWKB(?)", patch.Location.ToPostgis()))
	}

	q = q.Where(sq.Eq{"game_id": gameID, "user_id": userID})
	sql, args, err := q.ToSql()
	if err != nil {
		return err
	}
	_, err = p.db.Exec(ctx, sql, args...)
	return err
}

func (p *Player) Filter(ctx context.Context, filter *domain.FilterPlayer) ([]*domain.Player, error) {
	q := p.psql.Select("p.game_id", "p.user_id", "p.role", "p.score", "p.location", "u.username", "u.avatar", "u.background").
		From(`"player" AS p`).
		Join(`"user" AS u ON p.user_id = u.id`)

	if filter.GameID != nil {
		q = q.Where(sq.Eq{"p.game_id": *filter.GameID})
	}
	if filter.UserID != nil {
		q = q.Where(sq.Eq{"p.user_id": *filter.UserID})
	}
	if filter.Role != nil {
		q = q.Where(sq.Eq{"p.role": *filter.Role})
	}

	sql, args, err := q.ToSql()
	if err != nil {
		return nil, fmt.Errorf("error building query: %w", err)
	}

	rows, err := p.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, fmt.Errorf("error filtering players: %w", err)
	}
	defer rows.Close()

	players := []*domain.Player{}
	for rows.Next() {
		player, err := scanPlayer(rows)
		if err != nil {
			return nil, fmt.Errorf("error scanning player row: %w", err)
		}
		players = append(players, player)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating player rows: %w", err)
	}

	return players, nil
}

func (p *Player) Delete(ctx context.Context, gameID, userID string) error {
	q := p.psql.Delete(`"player"`).Where(sq.Eq{"game_id": gameID, "user_id": userID})

	sql, args, err := q.ToSql()
	if err != nil {
		return fmt.Errorf("error building query: %w", err)
	}

	_, err = p.db.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("error deleting player: %w", err)
	}
	return nil
}

type Scanner interface {
	Scan(dest ...interface{}) error
}

func scanPlayer(row Scanner) (*domain.Player, error) {
	player := &domain.Player{}
	player.User = &domain.User{}
	loc := postgis.PointS{}

	err := row.Scan(
		&player.GameID,
		&player.User.ID,
		&player.Role,
		&player.Score,
		&loc,
		&player.User.Username,
		&player.User.Avatar,
		&player.User.Background,
	)
	if err != nil {
		return nil, fmt.Errorf("error scanning player row: %w", err)
	}

	player.Location = domain.FromPostgis(loc)
	return player, nil
}
