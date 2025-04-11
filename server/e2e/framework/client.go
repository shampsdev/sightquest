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
	Token string

	FW  *Framework
	Cli *socketio.Client
}

func (c *Client) On(event string, f HandlerFunc) {
	c.Cli.OnEvent(event, func(_ socketio.Conn, arg interface{}) {
		log := slog.Default().With(
			"user", c.User.Username,
			"event", event,
		)
		log.Debug("Event received")
		c.FW.Session.RecordEvent(c.User, event, arg)
		err := f(c, arg)
		if err != nil {
			log.Error("Error", slogx.Err(err))
		}
	})
}

func (c *Client) Setup(toRecord map[string]struct{}) {
	c.Cli.OnConnect(func(_ socketio.Conn) error {
		c.Log.Debug("Connected")
		return nil
	})
	c.Cli.OnDisconnect(func(_ socketio.Conn, reason string) {
		c.Log.Debug("Disconnected", "reason", reason)
	})
	c.Cli.OnError(func(_ socketio.Conn, err error) {
		c.Log.Error("Error", slogx.Err(err))
	})

	for ev := range toRecord {
		c.On(ev, func(_ *Client, _ interface{}) error { return nil })
	}
}

func (c *Client) JoinGame(game *domain.Game) {
	c.Emit(event.Auth{
		Token: c.Token,
	})
	c.Emit(event.JoinGame{
		GameID: game.ID,
	})
}

func (c *Client) Emit(ev Event) {
	c.Cli.Emit(ev.Event(), ev)

	c.Log.With(
		"user", c.User.Username,
		"event", ev.Event(),
	).Debug("Event emitted")
}

func (c *Client) Close() error {
	return c.Cli.Close()
}
