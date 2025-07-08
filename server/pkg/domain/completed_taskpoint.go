package domain

import "time"

type CompletedTaskPoint struct {
	PlayerID  string    `json:"playerId"`
	GameID    string    `json:"gameId"`
	PointID   string    `json:"pointId"`
	CreatedAt time.Time `json:"createdAt"`
	Photo     string    `json:"photo"`
	Score     int       `json:"score"`
}

type CreateCompletedTaskPoint struct {
	PlayerID string `json:"playerId"`
	GameID   string `json:"gameId"`
	PointID  string `json:"pointId"`
	Photo    string `json:"photo"`
	Score    int    `json:"score"`
}

type PatchCompletedTaskPoint struct {
	Photo *string `json:"photo"`
	Score *int    `json:"score"`
}

type FilterCompletedTaskPoint struct {
	PlayerID *string `json:"playerId"`
	GameID   *string `json:"gameId"`
	PointID  *string `json:"pointId"`
	Limit    *int    `json:"limit"`

	SortByCreatedAtDesc bool `json:"sortByCreatedAtDesc"`
}
