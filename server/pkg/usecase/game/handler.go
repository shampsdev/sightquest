package game

import (
	"fmt"
	"log/slog"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/usecase/auth"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"
	"github.com/shampsdev/sightquest/server/pkg/usecase/state"
	"github.com/shampsdev/sightquest/server/pkg/usecase/usecore"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
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

	router           state.HandlerFunc[*PlayerState, state.AnyEvent]
	registeredEvents []string
}

type Context = *state.Context[*PlayerState]

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
	g := state.NewGroup[*PlayerState, state.AnyEvent]()
	gLog := state.GroupMW(g, h.logMW)

	gLog.
		On(event.AuthEvent, state.WrapT(h.OnAuth)).
		On(event.JoinGameEvent, state.WrapT(h.OnJoinGame)).
		On(event.LeaveGameEvent, state.WrapT(h.OnLeaveGame))

	gInGame := state.GroupMW(g, h.checkInGameMW)
	gInGame = state.GroupMW(gInGame, recordGameActivityMW)
	gInGame = state.GroupMW(gInGame, lockGameMW)

	// no logs
	gInGame.On(event.LocationUpdateEvent, callGame((*Game).OnLocationUpdate))

	gInGame = state.GroupMW(gInGame, h.logMW)
	gInGame.
		On(event.BroadcastEvent, callGame((*Game).OnBroadcast)).
		On(event.StartGameEvent, callGame((*Game).OnStartGame)).
		On(event.SetRouteEvent, callGame((*Game).OnSetRoute)).
		On(event.PauseEvent, callGame((*Game).OnPause)).
		On(event.UnpauseEvent, callGame((*Game).OnUnpause))

	h.router = g.RootHandler()
	h.registeredEvents = g.RegisteredEvents()
}

func (h *Handler) RegisteredEvents() []string {
	return h.registeredEvents
}

func callGame[E any](f func(g *Game, c Context, e E) error) state.HandlerFunc[*PlayerState, state.AnyEvent] {
	return state.WrapT(func(c *state.Context[*PlayerState], event E) error {
		return f(c.S.Game, c, event)
	})
}

func (h *Handler) OnConnect(c Context) error {
	c.S = &PlayerState{}
	c.Ctx = slogx.NewCtx(c.Ctx, slog.Default())
	slogx.Debug(c.Ctx, "Connected")

	c.OnError(func(c *state.Context[*PlayerState], err error) {
		slogx.Error(c.Ctx, "Error handling event", slogx.Err(err))
	})
	c.OnEmit(func(c *state.Context[*PlayerState], e state.Event) {
		slogx.Debug(c.Ctx, "Event emitted", "emitted_event", e.Event())
	})
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
	next state.HandlerFunc[*PlayerState, state.AnyEvent],
) error {
	log := slogx.FromCtx(c.Ctx).With("received_event", e.Event())
	log.Debug("Received event")
	return next(c.WithCtx(slogx.NewCtx(c.Ctx, log)), e)
}

func (h *Handler) checkInGameMW(
	c Context,
	e state.AnyEvent,
	next state.HandlerFunc[*PlayerState, state.AnyEvent],
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
	c.Ctx = slogx.With(c.Ctx, "username", user.Username, "user", user.ID)
	c.Emit(event.Authed{User: user})
	return nil
}

func (h *Handler) OnJoinGame(c Context, ev event.JoinGame) error {
	if c.S.User == nil {
		return fmt.Errorf("user not authenticated")
	}
	game, err := h.gameProvider.GetGame(c.Ctx, ev.GameID, c.Server())
	if err != nil {
		return err
	}
	c.S.Game = game
	c.Ctx = slogx.With(c.Ctx, "game", game.game.ID)
	return c.S.Game.OnJoinGame(c)
}

func (h *Handler) OnLeaveGame(c Context, _ event.LeaveGame) error {
	return c.Close()
}
