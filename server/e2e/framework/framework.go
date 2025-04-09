package framework

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	socketio "github.com/googollee/go-socket.io"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/e2e/framework/session"
	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/domain"
)

type Framework struct {
	Cfg *config.Config
	DB  *pgxpool.Pool
	Log *slog.Logger

	HTTPCli *http.Client
	APIHost string
	SIOHost string

	Session *session.Session
}

func MustInit() *Framework {
	fw := &Framework{}

	fw.Session = session.New()

	fw.Log = slog.Default()
	if !isE2ETesting() {
		return fw
	}

	fw.Cfg = config.Load("../e2e.env")
	fw.Log.Info("Loaded config")

	var err error
	fw.DB, err = pgxpool.NewWithConfig(context.Background(), fw.Cfg.PGXConfig())
	if err != nil {
		panic(err)
	}
	fw.Log.Info("Connected to database")

	fw.HTTPCli = &http.Client{Timeout: 10 * time.Second}
	fw.APIHost = "http://localhost:8001/api/v1"
	fw.SIOHost = "http://localhost:8001"

	return fw
}

func (fw *Framework) MustNewClient(username string) *Client {
	c, err := fw.NewClient(username)
	if err != nil {
		panic(err)
	}
	return c
}

func (fw *Framework) NewClient(username string) (*Client, error) {
	cli, err := socketio.NewClient(fw.SIOHost, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create client: %w", err)
	}

	token, err := fw.registerUser(username)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	c := &Client{
		fw:    fw,
		User:  &domain.User{Username: username},
		Log:   slog.Default(),
		cli:   cli,
		token: token,
	}
	c.setup(allEvents)

	err = c.cli.Connect()
	if err != nil {
		return nil, fmt.Errorf("failed to connect client: %w", err)
	}

	return c, nil
}

func (fw *Framework) RecordEvents(events ...string) {
	fw.Session.SetRecordEvents(events...)
}

func (fw *Framework) UseShortener(event string, sh session.Shortener) {
	fw.Session.UseShortener(event, sh)
}

// Step
// 1. Adds a new step to the session
// 2. Runs the function
// 3. Locks until the number of responses to be recorded is reached
//
// It is important that all incoming events are counted and not just recorded ones.
func (fw *Framework) Step(name string, f func(), waitNResponses uint32) {
	fw.Log.Info("Step", "number", name)
	fw.Session.NewStep(name)
	f()
	fw.Session.WaitNResponses(waitNResponses)
}
