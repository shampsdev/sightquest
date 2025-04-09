package gateways

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest"
	"github.com/shampsdev/sightquest/server/pkg/gateways/ws/sio"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
	"github.com/shampsdev/sightquest/server/pkg/usecase/game"
	"github.com/tj/go-spin"
	"golang.org/x/sync/errgroup"
)

const shutdownDuration = 1000 * time.Millisecond

type Server struct {
	RestServer *rest.Server
	WSServer   *sio.Server[game.PlayerState]
}

func shutdownWait() {
	spinner := spin.New()
	const spinIterations = 20
	for range spinIterations {
		fmt.Printf("\rgraceful shutdown %s ", spinner.Next())
		time.Sleep(shutdownDuration / spinIterations)
	}
	fmt.Println()
}

func NewServer(ctx context.Context, cfg *config.Config, cases *usecase.Cases) *Server {
	s := &Server{
		RestServer: rest.NewServer(ctx, cfg, cases),
	}
	s.WSServer = sio.NewServer(ctx, s.RestServer.Router, cases.GameHandler)
	return s
}

func (s *Server) Run(ctx context.Context) error {
	eg := errgroup.Group{}

	eg.Go(func() error {
		return s.RestServer.HTTPServer.ListenAndServe()
	})
	eg.Go(func() error {
		return s.WSServer.SIO.Serve()
	})

	<-ctx.Done()
	err := s.RestServer.HTTPServer.Shutdown(ctx)
	err = errors.Join(err, s.WSServer.SIO.Close())
	err = errors.Join(eg.Wait(), err)
	shutdownWait()
	return err
}
