package domain

type Player struct {
	GameID string `json:"gameId"`
	User   *User  `json:"user"`

	Role     PlayerRole `json:"role"`
	Score    int        `json:"score"`
	Location Coordinate `json:"location"`
}

type PlayerRole string

const (
	PlayerRoleRunner  PlayerRole = "runner"
	PlayerRoleCatcher PlayerRole = "catcher"
)
