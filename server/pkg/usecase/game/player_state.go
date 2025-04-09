package game

import (
	"fmt"
	"log/slog"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/usecase/auth"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"
	"github.com/shampsdev/sightquest/server/pkg/usecase/state"
	"github.com/shampsdev/sightquest/server/pkg/usecase/usecore"
)

type PlayerState struct {
	User *domain.User
	Game *Game
}

type Handler struct {
	gameProvider *InMemoryGameRepo
	userCase     *usecore.User
	auth         *auth.Auth
}

type Context = *state.Context[PlayerState]

func NewHandler(gameProvider *InMemoryGameRepo, userCase *usecore.User, auth *auth.Auth) *Handler {
	return &Handler{
		gameProvider: gameProvider,
		userCase:     userCase,
		auth:         auth,
	}
}

func (h *Handler) OnConnect(_ Context) error {
	return nil
}

func (h *Handler) OnDisconnect(_ Context) error {
	return nil
}

func (h *Handler) Handle(c Context, e state.AnyEvent) error {
	switch e.Event() {
	case event.AuthEvent:
		return state.WithMiddleware(h.logMW,
			state.WrapT(h.OnAuth))(c, e)
	case event.JoinGameEvent:
		return state.WithMiddleware(h.logMW,
			state.WrapT(h.OnJoinGame))(c, e)
	case event.LocationUpdateEvent:
		return state.WithMiddleware(h.logMW,
			state.WithMiddleware(h.checkInGameMW,
				state.WrapT(h.OnLocationUpdate)))(c, e)
	}
	return fmt.Errorf("unknown event: %s", e.Event())
}

func (h *Handler) logMW(
	c Context,
	e state.AnyEvent,
	next state.HandlerFunc[PlayerState, state.AnyEvent],
) error {
	c.Log = slog.Default().With("received_event", e.Event())
	if c.S.User != nil {
		c.Log = c.Log.With("user", c.S.User.ID)
	}
	if c.S.Game != nil {
		c.Log = c.Log.With("game", c.S.Game.game.ID)
	}
	c.Log.Debug("Event received")
	return next(c, e)
}

func (h *Handler) checkInGameMW(
	c Context,
	e state.AnyEvent,
	next state.HandlerFunc[PlayerState, state.AnyEvent],
) error {
	if c.S.User == nil {
		return fmt.Errorf("user not authenticated")
	}
	if c.S.Game == nil {
		return fmt.Errorf("user not in game")
	}
	return next(c, e)
}

func (h *Handler) OnAuth(c Context, ev event.Auth) error {
	userID, err := h.auth.ParseToken(ev.Token)
	if err != nil {
		return err
	}
	user, err := h.userCase.GetUserByID(c.Ctx, userID)
	if err != nil {
		return err
	}
	c.S.User = user
	return nil
}

func (h *Handler) OnJoinGame(c Context, ev event.JoinGame) error {
	if c.S.User == nil {
		return fmt.Errorf("user not authenticated")
	}
	game, err := h.gameProvider.GetGame(c.Ctx, ev.GameID)
	if err != nil {
		return err
	}
	c.S.Game = game
	c.S.Game.OnJoinGame(c)
	return nil
}

func (h *Handler) OnLocationUpdate(c Context, ev event.LocationUpdate) error {
	return c.S.Game.OnLocationUpdate(c, ev)
}
