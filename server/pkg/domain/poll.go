package domain

import (
	"time"
)

type Poll struct {
	ID        string      `json:"id"`
	GameID    string      `json:"gameId"`
	Type      PollType    `json:"type"`
	CreatedAt time.Time   `json:"createdAt"`
	Duration  *int        `json:"duration"`
	Data      *PollData   `json:"data"`
	Result    *PollResult `json:"result"`
	Votes     []*Vote     `json:"votes,omitempty"`
}

const (
	PollTypePause         PollType = "pause"
	PollTypeTaskCompleted PollType = "taskCompleted"
)

type PollData struct {
	Pause         *PollDataPause         `json:"pause"`
	TaskCompleted *PollDataTaskCompleted `json:"taskCompleted"`
}

type PollDataPause struct {
	Duration int     `json:"duration"`
	PausedBy *Player `json:"pausedBy"`
}

type PollDataTaskCompleted struct {
	Task   *TaskPoint `json:"task"`
	Player *Player    `json:"player"`
	Photo  string     `json:"photo"`
}

type PollResult struct{}

type PollType string

type CreatePoll struct {
	Type     PollType  `json:"type"`
	Duration *int      `json:"duration"`
	Data     *PollData `json:"data"`
	GameID   string    `json:"gameId"`
}

type PatchPoll struct {
	Type     *PollType   `json:"type"`
	Duration *int        `json:"duration"`
	Data     **PollData  `json:"data"`
	Result   *PollResult `json:"result"`
}

type FilterPoll struct {
	ID     *string   `json:"id"`
	Type   *PollType `json:"type"`
	GameID *string   `json:"gameId"`
	Limit  *int      `json:"limit"`

	SortByCreatedAtDesc bool `json:"sortByCreatedAtDesc"`
	IncludeVotes        bool `json:"includeVotes"`
}
