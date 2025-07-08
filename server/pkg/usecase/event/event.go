package event

import "github.com/shampsdev/sightquest/server/pkg/domain"

const (
	ErrorEvent           = "error"
	AuthEvent            = "auth"
	AuthedEvent          = "authed"
	JoinGameEvent        = "joinGame"
	SetRouteEvent        = "setRoute"
	SettedRouteEvent     = "settedRoute"
	GameEvent            = "game"
	PlayerJoinedEvent    = "playerJoined"
	PlayerLeftEvent      = "playerLeft"
	StartGameEvent       = "startGame"
	LocationUpdateEvent  = "locationUpdate"
	LocationUpdatedEvent = "locationUpdated"
	LeaveGameEvent       = "leaveGame"
	PauseEvent           = "pause"
	UnpauseEvent         = "unpause"

	TaskCompleteEvent = "taskComplete"
	TaskApproveEvent  = "taskApprove"
	TaskRejectEvent   = "taskReject"
	ScoreUpdatedEvent = "scoreUpdated"

	PlayerCatchEvent        = "playerCatch"
	PlayerCatchApproveEvent = "playerCatchApprove"
	PlayerCatchRejectEvent  = "playerCatchReject"
	PlayerRoleUpdatedEvent  = "roleUpdated"

	FinishGameEvent        = "finishGame"
	FinishGameApproveEvent = "finishGameApprove"
	FinishGameRejectEvent  = "finishGameReject"
	FinishedGameEvent      = "finishedGame"

	PollEvent = "poll"

	BroadcastEvent   = "broadcast"
	BroadcastedEvent = "broadcasted"
)

// server -> client
type Error struct {
	Error string `json:"error"`
}

func (e Error) Event() string { return ErrorEvent }

// client -> server
type Auth struct {
	Token string `json:"token"`
}

func (e Auth) Event() string { return AuthEvent }

// server -> client
type Authed struct {
	User *domain.User `json:"user"`
}

func (e Authed) Event() string { return AuthedEvent }

// client -> server
type JoinGame struct {
	GameID string `json:"gameId"`
}

func (e JoinGame) Event() string { return JoinGameEvent }

// client -> server
type SetRoute struct {
	RouteID string `json:"routeId"`
}

func (e SetRoute) Event() string { return SetRouteEvent }

// server -> client
type SettedRoute struct {
	Route *domain.Route `json:"route"`
}

func (e SettedRoute) Event() string { return SettedRouteEvent }

// server -> client
type Game struct {
	Game *domain.Game `json:"game"`
}

func (e Game) Event() string { return GameEvent }

// server -> client
type PlayerJoined struct {
	Player *domain.Player `json:"player"`
}

func (e PlayerJoined) Event() string { return PlayerJoinedEvent }

// server -> client
type PlayerLeft struct {
	Player *domain.Player `json:"player"`
}

func (e PlayerLeft) Event() string { return PlayerLeftEvent }

// server -> client
type Poll struct {
	Poll *domain.Poll `json:"poll"`
}

func (e Poll) Event() string { return PollEvent }

// client -> server
type Pause struct {
	PollDuration int `json:"pollDuration"`
}

func (e Pause) Event() string { return PauseEvent }

// client -> server
type Unpause struct{}

func (e Unpause) Event() string { return UnpauseEvent }

// client -> server
type TaskComplete struct {
	PollDuration *int   `json:"pollDuration"`
	TaskID       string `json:"taskId"`
	Photo        string `json:"photo"`
}

func (e TaskComplete) Event() string { return TaskCompleteEvent }

// client -> server
type TaskApprove struct {
	Comment string `json:"comment"`
}

func (e TaskApprove) Event() string { return TaskApproveEvent }

// client -> server
type TaskReject struct {
	Comment string `json:"comment"`
}

func (e TaskReject) Event() string { return TaskRejectEvent }

// server -> client
type ScoreUpdated struct {
	Player     *domain.Player `json:"player"`
	Score      int            `json:"score"`
	Reason     string         `json:"reason"`
	DeltaScore int            `json:"deltaScore"`
}

func (e ScoreUpdated) Event() string { return ScoreUpdatedEvent }

// client -> server
type PlayerCatch struct {
	PlayerID     string `json:"playerId"`
	Photo        string `json:"photo"`
	PollDuration *int   `json:"pollDuration"`
}

func (e PlayerCatch) Event() string { return PlayerCatchEvent }

// client -> server
type PlayerCatchApprove struct {
	Comment string `json:"comment"`
}

func (e PlayerCatchApprove) Event() string { return PlayerCatchApproveEvent }

// client -> server
type PlayerCatchReject struct {
	Comment string `json:"comment"`
}

func (e PlayerCatchReject) Event() string { return PlayerCatchRejectEvent }

// server -> client
type PlayerRoleUpdated struct {
	Player *domain.Player    `json:"player"`
	Role   domain.PlayerRole `json:"role"`
}

func (e PlayerRoleUpdated) Event() string { return PlayerRoleUpdatedEvent }

// client -> server
type LocationUpdate struct {
	Location domain.Coordinate `json:"location"`
}

func (e LocationUpdate) Event() string { return LocationUpdateEvent }

// server -> client
type LocationUpdated struct {
	Player   *domain.Player    `json:"player"`
	Location domain.Coordinate `json:"location"`
}

func (e LocationUpdated) Event() string { return LocationUpdatedEvent }

// client -> server
type Broadcast struct {
	Data any `json:"data"`
}

func (e Broadcast) Event() string { return BroadcastEvent }

// server -> client
type Broadcasted struct {
	From *domain.Player `json:"player"`
	Data any            `json:"data"`
}

func (e Broadcasted) Event() string { return BroadcastedEvent }

// server -> client
// client -> server
type StartGame struct{}

func (e StartGame) Event() string { return StartGameEvent }

// client -> server
type FinishGame struct {
	Comment      string `json:"comment"`
	PollDuration *int   `json:"pollDuration"`
}

func (e FinishGame) Event() string { return FinishGameEvent }

// client -> server
type FinishGameApprove struct {
	Comment string `json:"comment"`
}

func (e FinishGameApprove) Event() string { return FinishGameApproveEvent }

// client -> server
type FinishGameReject struct {
	Comment string `json:"comment"`
}

func (e FinishGameReject) Event() string { return FinishGameRejectEvent }

// server -> client
type FinishedGame struct{}

func (e FinishedGame) Event() string { return FinishedGameEvent }

// client -> server
type LeaveGame struct{}

func (e LeaveGame) Event() string { return LeaveGameEvent }
