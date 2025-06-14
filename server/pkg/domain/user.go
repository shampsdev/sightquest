package domain

type User struct {
	ID       string     `json:"id"`
	Name     string     `json:"name"`
	Username string     `json:"username"`
	Styles   UserStyles `json:"styles"`
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
	Name       *string     `json:"name"`
	Username   *string     `json:"username"`
	UserStyles *UserStyles `json:"userStyles"`
}

type FilterUser struct {
	ID       *string `json:"id"`
	Email    *string `json:"email"`
	Username *string `json:"username"`
}

type UserStyles struct {
	AvatarID string `json:"avatarId"`
}
