package pg

import (
	"context"
	"fmt"

	"github.com/Vaniog/go-postgis"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type Player struct {
	db       *pgxpool.Pool
	userRepo repo.User
}

func NewPlayer(db *pgxpool.Pool, userRepo repo.User) *Player {
	return &Player{
		db:       db,
		userRepo: userRepo,
	}
}

func (p *Player) CreatePlayer(ctx context.Context, player *domain.Player) error {
	q := `INSERT INTO "player" ("game_id", "user_id", "role", "score", "location") VALUES ($1, $2, $3, $4, GeomFromEWKB($5))`
	_, err := p.db.Exec(ctx, q, player.GameID, player.User.ID, player.Role, player.Score, player.Location.ToPostgis())
	if err != nil {
		return fmt.Errorf("error creating player: %w", err)
	}
	return nil
}

func (p *Player) DeletePlayer(ctx context.Context, gameID, userID string) error {
	q := `DELETE FROM "player" WHERE "game_id" = $1 AND "user_id" = $2`
	_, err := p.db.Exec(ctx, q, gameID, userID)
	if err != nil {
		return err
	}
	return nil
}

func (p *Player) GetPlayer(ctx context.Context, gameID, userID string) (*domain.Player, error) {
	q := `
	    SELECT p.game_id, p.user_id, p.role, p.score, p.location, u.username, u.avatar, u.background
        FROM player AS p
        JOIN "user" AS u ON p.user_id = u.id
        WHERE p.game_id = $1 AND p.user_id = $2
	`

	player, err := scanPlayer(p.db.QueryRow(ctx, q, gameID, userID))
	if err != nil {
		return nil, fmt.Errorf("error getting player: %w", err)
	}

	return player, nil
}

func (p *Player) GetPlayersByGameID(ctx context.Context, gameID string) ([]*domain.Player, error) {
	q := ` 
        SELECT p.game_id, p.user_id, p.role, p.score, p.location, u.username, u.avatar, u.background
        FROM player AS p
        JOIN "user" AS u ON p.user_id = u.id
        WHERE p.game_id = $1
	`

	rows, err := p.db.Query(ctx, q, gameID)
	if err != nil {
		return nil, fmt.Errorf("error getting players by game ID: %w", err)
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

func (p *Player) UpdatePlayer(ctx context.Context, player *domain.Player) error {
	q := `
        UPDATE player
        SET role = $1, score = $2, location = GeomFromEWKB($3)
        WHERE game_id = $4 AND user_id = $5
    `
	_, err := p.db.Exec(ctx, q,
		player.Role,
		player.Score,
		player.Location.ToPostgis(),
		player.GameID,
		player.User.ID,
	)
	if err != nil {
		return fmt.Errorf("error updating player: %w", err)
	}

	return nil
}
