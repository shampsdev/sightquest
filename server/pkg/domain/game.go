package domain

import "time"

type Game struct {
	ID      string    `json:"id"`
	Admin   *User     `json:"admin"`
	State   GameState `json:"state"`
	Players []*Player `json:"players"`

	CreatedAt  time.Time  `json:"createdAt"`
	FinishedAt *time.Time `json:"finishedAt"`
}

type GameState string

type CreateGame struct {
	AdminID string    `json:"admin_id"`
	State   GameState `json:"state"`
}

const (
	GameStateLobby    GameState = "lobby"
	GameStateGame     GameState = "game"
	GameStatePoll     GameState = "poll"
	GameStateFinished GameState = "finished"
)
