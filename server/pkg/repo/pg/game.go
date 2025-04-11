package pg

import (
	"context"
	"fmt"
	"math/rand/v2"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type Game struct {
	db   *pgxpool.Pool
	ur   repo.User
	rand *rand.Rand
}

func NewGame(db *pgxpool.Pool, ur repo.User) *Game {
	return &Game{
		rand: rand.New(rand.NewPCG(uint64(time.Now().UnixNano()), rand.Uint64())),
		db:   db,
		ur:   ur,
	}
}

func (g *Game) CreateGame(ctx context.Context, game *domain.CreateGame) (string, error) {
	gameID := g.generateID()
	q := `INSERT INTO game (id, admin_id, state) VALUES ($1, $2, $3)`
	_, err := g.db.Exec(ctx, q, gameID, game.AdminID, game.State)
	if err != nil {
		return "", fmt.Errorf("failed to create game: %w", err)
	}
	return gameID, nil
}

func (g *Game) GetGameByID(ctx context.Context, gameID string) (*domain.Game, error) {
	q := `SELECT id, state, admin_id, created_at, finished_at FROM game WHERE id = $1`
	game := &domain.Game{}
	game.Admin = &domain.User{}
	err := g.db.QueryRow(ctx, q, gameID).Scan(&game.ID, &game.State, &game.Admin.ID, &game.CreatedAt, &game.FinishedAt)
	if err != nil {
		return nil, err
	}

	admin, err := g.ur.GetUserByID(ctx, game.Admin.ID)
	if err != nil {
		return nil, err
	}

	return &domain.Game{
		ID:         game.ID,
		State:      game.State,
		Admin:      admin,
		Players:    []*domain.Player{},
		CreatedAt:  game.CreatedAt,
		FinishedAt: game.FinishedAt,
	}, nil
}

func (g *Game) UpdateGame(ctx context.Context, game *domain.Game) error {
	q := `UPDATE game SET state = $1, finished_at = $2 WHERE id = $3`
	_, err := g.db.Exec(ctx, q, game.State, game.FinishedAt, game.ID)
	return err
}

var letterRunes = []rune("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")

func (g *Game) generateID() string {
	b := make([]rune, 5)
	for i := range b {
		b[i] = letterRunes[g.rand.IntN(len(letterRunes))]
	}
	return string(b)
}
