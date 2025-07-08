package domain

import (
	"time"
)

type Poll struct {
	ID         string      `json:"id"`
	GameID     string      `json:"gameId"`
	Type       PollType    `json:"type"`
	State      PollState   `json:"state"`
	Duration   *int        `json:"duration"`
	Data       *PollData   `json:"data"`
	Result     *PollResult `json:"result"`
	Votes      []*Vote     `json:"votes,omitempty"`
	CreatedAt  time.Time   `json:"createdAt"`
	FinishedAt *time.Time  `json:"finishedAt,omitempty"`
}

type PollType string

const (
	PollTypePause        PollType = "pause"
	PollTypeTaskComplete PollType = "taskComplete"
	PollTypePlayerCatch  PollType = "playerCatch"
)

type PollState string

const (
	PollStateActive   PollState = "active"
	PollStateFinished PollState = "finished"
)

type PollData struct {
	Pause        *PollDataPause        `json:"pause,omitempty"`
	TaskComplete *PollDataTaskComplete `json:"taskComplete,omitempty"`
	PlayerCatch  *PollDataPlayerCatch  `json:"playerCatch,omitempty"`
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

type PollDataPlayerCatch struct {
	Runner    *Player `json:"runner"`
	CatchedBy *Player `json:"catchedBy"`
	Photo     string  `json:"photo"`
}

type PollResult struct {
	Pause        *PollResultPause        `json:"pause,omitempty"`
	TaskComplete *PollResultTaskComplete `json:"taskComplete,omitempty"`
	PlayerCatch  *PollResultPlayerCatch  `json:"playerCatch,omitempty"`
}

type PollResultPause struct {
	UnpausedBy *Player `json:"unpausedBy"`
}

type PollResultTaskComplete struct {
	Approved           bool                `json:"approved"`
	CompletedTaskPoint *CompletedTaskPoint `json:"completedTaskPoint,omitempty"`
}

type PollResultPlayerCatch struct {
	Approved      bool    `json:"approved"`
	CatcherReward int     `json:"catcherReward"`
	NewRunner     *Player `json:"newRunner"`
}

type CreatePoll struct {
	Type     PollType  `json:"type"`
	State    PollState `json:"state"`
	Duration *int      `json:"duration"`
	Data     *PollData `json:"data"`
	GameID   string    `json:"gameId"`
}

type PatchPoll struct {
	Type       *PollType    `json:"type"`
	State      *PollState   `json:"state"`
	Duration   *int         `json:"duration"`
	Data       **PollData   `json:"data"`
	Result     **PollResult `json:"result"`
	FinishedAt **time.Time  `json:"finishedAt"`
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
