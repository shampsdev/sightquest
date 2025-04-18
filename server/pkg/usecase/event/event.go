package event

import "github.com/shampsdev/sightquest/server/pkg/domain"

const (
	ErrorEvent           = "error"
	AuthEvent            = "auth"
	AuthedEvent          = "authed"
	JoinGameEvent        = "joinGame"
	GameEvent            = "game"
	PlayerJoinedEvent    = "playerJoined"
	PlayerLeftEvent      = "playerLeft"
	StartGameEvent       = "startGame"
	LocationUpdateEvent  = "locationUpdate"
	LocationUpdatedEvent = "locationUpdated"
	LeaveGameEvent       = "leaveGame"

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
type LeaveGame struct{}

func (e LeaveGame) Event() string { return LeaveGameEvent }
