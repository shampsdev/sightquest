package domain

import "time"

type Game struct {
	ID                  string                `json:"id"`
	Admin               *User                 `json:"admin"`
	State               GameState             `json:"state"`
	Route               *Route                `json:"route,omitempty"`
	Players             []*Player             `json:"players"`
	ActivePoll          *Poll                 `json:"activePoll,omitempty"`
	CompletedTaskPoints []*CompletedTaskPoint `json:"completedTaskPoints"`

	CreatedAt  time.Time  `json:"createdAt"`
	FinishedAt *time.Time `json:"finishedAt"`
}

type GameState string

type CreateGame struct {
	AdminID string    `json:"admin_id"`
	State   GameState `json:"state"`
}

type PatchGame struct {
	State      *GameState  `json:"state"`
	RouteID    *string     `json:"routeId"`
	FinishedAt **time.Time `json:"finishedAt"`
}

type FilterGame struct {
	ID       *string    `json:"id"`
	AdminID  *string    `json:"adminId"`
	PlayerID *string    `json:"playerId"`
	State    *GameState `json:"state"`
	Limit    *int       `json:"limit"`

	SortByCreatedAtDesc bool `json:"sortByCreatedAtDesc"`
	IncludeAdmin        bool `json:"includeAdmin"`
	IncludeRoute        bool `json:"includeRoute"`
}

const (
	GameStateLobby    GameState = "lobby"
	GameStateGame     GameState = "game"
	GameStatePoll     GameState = "poll"
	GameStateFinished GameState = "finished"
)
