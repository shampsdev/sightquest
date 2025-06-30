package domain

import (
	"time"
)

type Poll struct {
	ID        string      `json:"id"`
	GameID    string      `json:"gameId"`
	Type      PollType    `json:"type"`
	State     PollState   `json:"state"`
	CreatedAt time.Time   `json:"createdAt"`
	Duration  *int        `json:"duration"`
	Data      *PollData   `json:"data"`
	Result    *PollResult `json:"result"`
	Votes     []*Vote     `json:"votes,omitempty"`
}

type PollType string

const (
	PollTypePause        PollType = "pause"
	PollTypeTaskComplete PollType = "taskComplete"
)

type PollState string

const (
	PollStateActive   PollState = "active"
	PollStateFinished PollState = "finished"
)

type PollData struct {
	Pause        *PollDataPause        `json:"pause,omitempty"`
	TaskComplete *PollDataTaskComplete `json:"taskComplete,omitempty"`
}

type PollDataPause struct {
	Duration int     `json:"duration"`
	PausedBy *Player `json:"pausedBy"`
}

type PollDataTaskComplete struct {
	Task   *TaskPoint `json:"task"`
	Player *Player    `json:"player"`
	Photo  string     `json:"photo"`
}

type PollResult struct {
	Pause        *PollResultPause        `json:"pause,omitempty"`
	TaskComplete *PollResultTaskComplete `json:"taskComplete,omitempty"`
}

type PollResultPause struct {
	UnpausedBy *Player `json:"unpausedBy"`
}

type PollResultTaskComplete struct {
	Approved bool `json:"approved"`
}

type CreatePoll struct {
	Type     PollType  `json:"type"`
	State    PollState `json:"state"`
	Duration *int      `json:"duration"`
	Data     *PollData `json:"data"`
	GameID   string    `json:"gameId"`
}

type PatchPoll struct {
	Type     *PollType    `json:"type"`
	State    *PollState   `json:"state"`
	Duration *int         `json:"duration"`
	Data     **PollData   `json:"data"`
	Result   **PollResult `json:"result"`
}

type FilterPoll struct {
	ID     *string    `json:"id"`
	Type   *PollType  `json:"type"`
	State  *PollState `json:"state"`
	GameID *string    `json:"gameId"`
	Limit  *int       `json:"limit"`

	SortByCreatedAtDesc bool `json:"sortByCreatedAtDesc"`
	IncludeVotes        bool `json:"includeVotes"`
}
