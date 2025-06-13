package domain

type User struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Username   string `json:"username"`
	Avatar     string `json:"avatar"`
	Background string `json:"background"`
}

type UserCredentials struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CreateUser struct {
	UserCredentials
	Name string `json:"name"`
}

type PatchUser struct {
	Name       *string `json:"name"`
	Username   *string `json:"username"`
	Avatar     *string `json:"avatar"`
	Background *string `json:"background"`
}

type FilterUser struct {
	ID       *string `json:"id"`
	Email    *string `json:"email"`
	Username *string `json:"username"`
}
