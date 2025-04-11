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
	User   *domain.User
	Player *domain.Player
	Game   *Game
}

type Handler struct {
	gameProvider *InMemoryGameRepo
	userCase     *usecore.User
	auth         *auth.Auth

	router           state.HandlerFunc[PlayerState, state.AnyEvent]
	registeredEvents []string
}

type Context = *state.Context[PlayerState]

func NewHandler(gameProvider *InMemoryGameRepo, userCase *usecore.User, auth *auth.Auth) *Handler {
	h := &Handler{
		gameProvider: gameProvider,
		userCase:     userCase,
		auth:         auth,
	}
	h.buildRouter()
	return h
}

func (h *Handler) buildRouter() {
	g := state.GroupMW(
		state.NewGroup[PlayerState, state.AnyEvent](),
		h.logMW)

	g.
		On(event.AuthEvent, state.WrapT(h.OnAuth)).
		On(event.JoinGameEvent, state.WrapT(h.OnJoinGame)).
		On(event.LeaveGameEvent, state.WrapT(h.OnLeaveGame))

	gInGame := state.GroupMW(g, h.checkInGameMW)
	gInGame = state.GroupMW(gInGame, recordGameActivityMW)

	gInGame.
		On(event.LocationUpdateEvent, callGame((*Game).OnLocationUpdate)).
		On(event.BroadcastEvent, callGame((*Game).OnBroadcast)).
		On(event.StartGameEvent, callGame((*Game).OnStartGame))

	h.router = g.RootHandler()
	h.registeredEvents = g.RegisteredEvents()
}

func (h *Handler) RegisteredEvents() []string {
	return h.registeredEvents
}

func callGame[E any](f func(g *Game, c Context, e E) error) state.HandlerFunc[PlayerState, state.AnyEvent] {
	return state.WrapT(func(c *state.Context[PlayerState], event E) error {
		return f(c.S.Game, c, event)
	})
}

func (h *Handler) OnConnect(_ Context) error {
	return nil
}

func (h *Handler) OnDisconnect(c Context) error {
	if c.S.Game != nil {
		return c.S.Game.OnDisconnect(c)
	}
	return nil
}

func (h *Handler) Handle(c Context, e state.AnyEvent) error {
	return h.router(c, e)
}

func (h *Handler) logMW(
	c Context,
	e state.AnyEvent,
	next state.HandlerFunc[PlayerState, state.AnyEvent],
) error {
	c.Log = slog.Default().With("received_event", e.Event())
	if c.S.User != nil {
		c.Log = c.Log.With("user", c.S.User.Username)
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
	c.Emit(event.Authed{User: user})
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
	return c.S.Game.OnJoinGame(c)
}

func (h *Handler) OnLeaveGame(c Context, _ event.LeaveGame) error {
	return c.Close()
}
