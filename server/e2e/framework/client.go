package framework

import (
	"log/slog"

	socketio "github.com/googollee/go-socket.io"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

type Event interface {
	Event() string
}

type HandlerFunc func(c *Client, arg interface{}) error

type Client struct {
	User  *domain.User
	Log   *slog.Logger
	token string

	fw  *Framework
	cli *socketio.Client
}

func (c *Client) On(event string, f HandlerFunc) {
	c.cli.OnEvent(event, func(_ socketio.Conn, arg interface{}) {
		log := slog.Default().With(
			"user", c.User.Username,
			"event", event,
		)
		log.Debug("Event received")
		c.fw.Session.RecordEvent(c.User, event, arg)
		err := f(c, arg)
		if err != nil {
			log.Error("Error", slogx.Err(err))
		}
	})
}

func (c *Client) setup(toRecord map[string]struct{}) {
	c.cli.OnConnect(func(_ socketio.Conn) error {
		c.Log.Debug("Connected")
		return nil
	})
	c.cli.OnDisconnect(func(_ socketio.Conn, reason string) {
		c.Log.Debug("Disconnected", "reason", reason)
	})
	c.cli.OnError(func(_ socketio.Conn, err error) {
		c.Log.Error("Error", slogx.Err(err))
	})

	for ev := range toRecord {
		c.On(ev, func(_ *Client, _ interface{}) error { return nil })
	}
}

func (c *Client) JoinGame(game *domain.Game) {
	c.Emit(event.Auth{
		Token: c.token,
	})
	c.Emit(event.JoinGame{
		GameID: game.ID,
	})
}

func (c *Client) Emit(ev Event) {
	c.cli.Emit(ev.Event(), ev)

	c.Log.With(
		"user", c.User.Username,
		"event", ev.Event(),
	).Debug("Event emitted")
}

func (c *Client) Close() error {
	return c.cli.Close()
}
