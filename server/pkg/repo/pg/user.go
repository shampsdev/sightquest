package pg

import (
	"context"
	"errors"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type User struct {
	psql sq.StatementBuilderType
	db   *pgxpool.Pool
}

func NewUser(db *pgxpool.Pool) *User {
	return &User{
		db:   db,
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (u *User) CreateUser(ctx context.Context, user *domain.CreateUser, password string) (string, error) {
	q := `INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3) RETURNING id`
	var id string
	err := u.db.QueryRow(ctx, q, user.Username, user.Email, password).Scan(&id)
	return id, err
}

func (u *User) GetUserPassword(ctx context.Context, userID string) (string, error) {
	q := `SELECT password FROM "user" WHERE id = $1`
	var password string
	err := u.db.QueryRow(ctx, q, userID).Scan(&password)
	return password, err
}

func (u *User) GetUserByID(ctx context.Context, id string) (*domain.User, error) {
	return u.queryUser(ctx, sq.Eq{"id": id})
}

func (u *User) GetUserByUsername(ctx context.Context, username string) (*domain.User, error) {
	return u.queryUser(ctx, sq.Eq{"username": username})
}

func (u *User) GetUserByEmail(ctx context.Context, email string) (*domain.User, error) {
	return u.queryUser(ctx, sq.Eq{"email": email})
}

func (u *User) queryUser(ctx context.Context, condition sq.Eq) (*domain.User, error) {
	sql, args, err := u.psql.Select("id", "username", "avatar", "background").
		From(`"user"`).
		Where(condition).ToSql()
	if err != nil {
		return nil, err
	}

	var user domain.User
	err = u.db.QueryRow(ctx, sql, args...).Scan(&user.ID, &user.Username, &user.Avatar, &user.Background)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, repo.ErrUserNotFound
	}
	return &user, err
}
