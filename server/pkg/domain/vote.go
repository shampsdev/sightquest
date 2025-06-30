package domain

import "time"

type Vote struct {
	PollID    string    `json:"pollId"`
	PlayerID  string    `json:"playerId"`
	GameID    string    `json:"gameId"`
	Type      VoteType  `json:"type"`
	Data      *VoteData `json:"data"`
	CreatedAt time.Time `json:"createdAt"`
}

type VoteType string

const (
	VoteTypeUnpause VoteType = "unpause"
)

type VoteData struct{}

type CreateVote struct {
	PollID   string    `json:"pollId"`
	PlayerID string    `json:"playerId"`
	GameID   string    `json:"gameId"`
	Type     VoteType  `json:"type"`
	Data     *VoteData `json:"data"`
}

type PatchVote struct {
	Type *VoteType  `json:"type"`
	Data **VoteData `json:"data"`
}

type FilterVote struct {
	PollID   *string   `json:"pollId"`
	PlayerID *string   `json:"playerId"`
	GameID   *string   `json:"gameId"`
	Type     *VoteType `json:"type"`
	Limit    *int      `json:"limit"`

	SortByCreatedAtDesc bool `json:"sortByCreatedAtDesc"`
}
