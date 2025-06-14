package pg

import (
	"context"
	"fmt"
	"math/rand/v2"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type Game struct {
	psql sq.StatementBuilderType
	db   *pgxpool.Pool
	ur   repo.User
	rr   repo.Route
	rand *rand.Rand
}

func NewGame(db *pgxpool.Pool, ur repo.User, rr repo.Route) *Game {
	return &Game{
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
		rand: rand.New(rand.NewPCG(uint64(time.Now().UnixNano()), rand.Uint64())),
		db:   db,
		ur:   ur,
		rr:   rr,
	}
}

func (g *Game) Create(ctx context.Context, game *domain.CreateGame) (string, error) {
	gameID := g.generateID()
	q := g.psql.Insert("game").
		Columns("id", "admin_id", "state").
		Values(gameID, game.AdminID, game.State)

	sql, args, err := q.ToSql()
	if err != nil {
		return "", fmt.Errorf("failed to build query: %w", err)
	}

	_, err = g.db.Exec(ctx, sql, args...)
	if err != nil {
		return "", fmt.Errorf("failed to create game: %w", err)
	}
	return gameID, nil
}

func (g *Game) Patch(ctx context.Context, id string, patch *domain.PatchGame) error {
	q := g.psql.Update("game")

	if patch.State != nil {
		q = q.Set("state", *patch.State)
	}
	if patch.RouteID != nil {
		q = q.Set("route_id", *patch.RouteID)
	}
	if patch.FinishedAt != nil {
		q = q.Set("finished_at", *patch.FinishedAt)
	}

	q = q.Where(sq.Eq{"id": id})

	sql, args, err := q.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	_, err = g.db.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("failed to update game: %w", err)
	}

	return nil
}

func (g *Game) Filter(ctx context.Context, filter *domain.FilterGame) ([]*domain.Game, error) {
	q := g.psql.Select(
		"g.id",
		"g.state",
		"g.admin_id",
		"g.route_id",
		"g.created_at",
		"g.finished_at",
	).
		From("game AS g")

	if filter.PlayerID != nil {
		q = q.Join("player AS p ON g.id = p.game_id").
			Where(sq.Eq{"p.user_id": *filter.PlayerID})
	}
	if filter.ID != nil {
		q = q.Where(sq.Eq{"g.id": *filter.ID})
	}
	if filter.AdminID != nil {
		q = q.Where(sq.Eq{"g.admin_id": *filter.AdminID})
	}
	if filter.State != nil {
		q = q.Where(sq.Eq{"g.state": *filter.State})
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

	rows, err := g.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to filter games: %w", err)
	}
	defer rows.Close()

	games := []*domain.Game{}
	for rows.Next() {
		game := &domain.Game{}
		game.Admin = &domain.User{}
		routeID := new(string)
		err := rows.Scan(
			&game.ID,
			&game.State,
			&game.Admin.ID,
			&routeID,
			&game.CreatedAt,
			&game.FinishedAt,
		)
		if routeID != nil {
			game.Route = &domain.Route{ID: *routeID}
		}
		if err != nil {
			return nil, fmt.Errorf("failed to scan game: %w", err)
		}

		if filter.IncludeAdmin {
			admin, err := repo.First(g.ur)(ctx, &domain.FilterUser{ID: &game.Admin.ID})
			if err != nil {
				return nil, fmt.Errorf("failed to get admin: %w", err)
			}
			game.Admin = admin
		}
		if filter.IncludeRoute && game.Route != nil {
			route, err := repo.First(g.rr)(ctx, &domain.FilterRoute{ID: &game.Route.ID})
			if err != nil {
				return nil, fmt.Errorf("failed to get route: %w", err)
			}
			game.Route = route
		}

		game.Players = []*domain.Player{}
		games = append(games, game)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating game rows: %w", err)
	}

	return games, nil
}

func (g *Game) Delete(ctx context.Context, id string) error {
	q := g.psql.Delete("game").Where(sq.Eq{"id": id})

	sql, args, err := q.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	_, err = g.db.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("failed to delete game: %w", err)
	}
	return nil
}

var letterRunes = []rune("0123456789")

func (g *Game) generateID() string {
	b := make([]rune, 6)
	for i := range b {
		b[i] = letterRunes[g.rand.IntN(len(letterRunes))]
	}
	return string(b)
}
