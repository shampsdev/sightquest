package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

func main() {
	cfg := config.Load(".env")
	log := cfg.Logger()
	log.Info("Hello from sightquest server!")

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()
	ctx = slogx.NewCtx(ctx, log)

	pool, err := pgxpool.NewWithConfig(ctx, cfg.PGXConfig())
	if err != nil {
		log.Error("can't create new database pool")
		os.Exit(1)
	}
	defer pool.Close()

	s := rest.NewServer(ctx, cfg, usecase.Setup(ctx, cfg, pool))
	if err := s.Run(ctx); err != nil && !errors.Is(err, http.ErrServerClosed) {
		slogx.WithErr(log, err).Error("error during server shutdown")
	}
}
