package event

import "github.com/shampsdev/sightquest/server/pkg/domain"

const (
	ErrorEvent          = "error"
	AuthEvent           = "auth"
	AuthResponseEvent   = "authResponse"
	JoinGameEvent       = "joinGame"
	GameEvent           = "game"
	PlayerJoinedEvent   = "playerJoined"
	StartGameEvent      = "startGame"
	LocationUpdateEvent = "locationUpdate"

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
type AuthResponse struct {
	User *domain.User `json:"user"`
}

func (e AuthResponse) Event() string { return AuthResponseEvent }

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
// client -> server
type LocationUpdate struct {
	Location domain.Coordinate `json:"location"`
}

func (e LocationUpdate) Event() string { return LocationUpdateEvent }

// client -> server
type Broadcast struct {
	Data any `json:"data"`
}

func (e Broadcast) Event() string { return BroadcastEvent }

// server -> client
type Broadcasted struct {
	From *domain.Player `json:"from"`
	Data any            `json:"data"`
}

func (e Broadcasted) Event() string { return BroadcastedEvent }
