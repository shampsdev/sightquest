package domain

type Player struct {
	GameID string `json:"gameId"`
	User   *User  `json:"user"`

	Role     PlayerRole `json:"role"`
	Score    int        `json:"score"`
	Location Coordinate `json:"location"`
}

type CreatePlayer struct {
	GameID   string     `json:"gameId"`
	UserID   string     `json:"userId"`
	Role     PlayerRole `json:"role"`
	Score    int        `json:"score"`
	Location Coordinate `json:"location"`
}

type PatchPlayer struct {
	Role     *PlayerRole `json:"role"`
	Score    *int        `json:"score"`
	Location *Coordinate `json:"location"`
}

type FilterPlayer struct {
	GameID *string     `json:"gameId"`
	UserID *string     `json:"userId"`
	Role   *PlayerRole `json:"role"`
}

type PlayerRole string

const (
	PlayerRoleRunner  PlayerRole = "runner"
	PlayerRoleCatcher PlayerRole = "catcher"
)
