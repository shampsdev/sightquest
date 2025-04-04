package domain

type User struct {
	ID         string `json:"id"`
	Username   string `json:"username"`
	Avatar     string `json:"avatar"`
	Background string `json:"background"`

	CreatedAt string `json:"created_at"`
}

type UserCredentials struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CreateUser struct {
	Username string `json:"username"`
	Email    string `json:"email"`
}
