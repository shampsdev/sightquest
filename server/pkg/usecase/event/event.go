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
)

type Error struct {
	Error string `json:"error"`
}

func (e Error) Event() string { return ErrorEvent }

type Auth struct {
	Token string `json:"token"`
}

func (e Auth) Event() string { return AuthEvent }

type AuthResponse struct {
	User *domain.User `json:"user"`
}

func (e AuthResponse) Event() string { return AuthResponseEvent }

type JoinGame struct {
	GameID string `json:"gameId"`
}

func (e JoinGame) Event() string { return JoinGameEvent }

type Game struct {
	Game *domain.Game `json:"game"`
}

func (e Game) Event() string { return GameEvent }

type PlayerJoined struct {
	Player *domain.Player `json:"player"`
}

func (e PlayerJoined) Event() string { return PlayerJoinedEvent }

type LocationUpdate struct {
	Location domain.Coordinate `json:"location"`
}

func (e LocationUpdate) Event() string { return LocationUpdateEvent }
