package pg

import (
	"context"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/domain"
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

func (u *User) Create(ctx context.Context, user *domain.CreateUser) (string, error) {
	q := `INSERT INTO "user" (username, email, password, name) VALUES ($1, $2, $3, $4) RETURNING id`
	var id string
	err := u.db.QueryRow(ctx, q, user.Username, user.Email, user.Password, user.Name).Scan(&id)
	return id, err
}

func (u *User) GetPassword(ctx context.Context, userID string) (string, error) {
	q := `SELECT password FROM "user" WHERE id = $1`
	var password string
	err := u.db.QueryRow(ctx, q, userID).Scan(&password)
	return password, err
}

func (u *User) Filter(ctx context.Context, filter *domain.FilterUser) ([]*domain.User, error) {
	q := u.psql.Select("id", "name", "username", "avatar", "background").From(`"user"`)
	if filter.ID != nil {
		q = q.Where(sq.Eq{"id": *filter.ID})
	}
	if filter.Username != nil {
		q = q.Where(sq.Eq{"username": *filter.Username})
	}
	if filter.Email != nil {
		q = q.Where(sq.Eq{"email": *filter.Email})
	}
	sql, args, err := q.ToSql()
	if err != nil {
		return nil, err
	}

	rows, err := u.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*domain.User
	for rows.Next() {
		var user domain.User
		err := rows.Scan(&user.ID, &user.Name, &user.Username, &user.Avatar, &user.Background)
		if err != nil {
			return nil, err
		}
		users = append(users, &user)
	}
	return users, nil
}

func (u *User) Patch(ctx context.Context, id string, user *domain.PatchUser) error {
	q := u.psql.Update(`"user"`)
	if user.Name != nil {
		q = q.Set("name", *user.Name)
	}
	if user.Username != nil {
		q = q.Set("username", *user.Username)
	}
	if user.Avatar != nil {
		q = q.Set("avatar", *user.Avatar)
	}
	if user.Background != nil {
		q = q.Set("background", *user.Background)
	}
	q = q.Where(sq.Eq{"id": id})
	sql, args, err := q.ToSql()
	if err != nil {
		return err
	}
	_, err = u.db.Exec(ctx, sql, args...)
	return err
}

func (u *User) Delete(ctx context.Context, id string) error {
	q := u.psql.Delete(`"user"`).Where(sq.Eq{"id": id})
	sql, args, err := q.ToSql()
	if err != nil {
		return err
	}
	_, err = u.db.Exec(ctx, sql, args...)
	return err
}
