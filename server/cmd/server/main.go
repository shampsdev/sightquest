package main

import (
	"context"
	"errors"
	"flag"
	"net/http"
	"os"
	"os/signal"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/gateways"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

var envFile = flag.String("env-file", ".env", "path to env file")

// @title   Sightquest server
// @version 1.0
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name X-API-Token
func main() {
	flag.Parse()
	cfg := config.Load(*envFile)
	log := cfg.Logger()
	log.Info("Hello from sightquest server!")

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()
	ctx = slogx.NewCtx(ctx, log)

	pool, err := pgxpool.NewWithConfig(ctx, cfg.PGXConfig())
	if err != nil {
		slogx.Fatal(log, "failed to connect to database", slogx.Err(err))
	}
	defer pool.Close()

	cases, err := usecase.Setup(ctx, cfg, pool)
	if err != nil {
		slogx.Fatal(log, "failed to setup usecase", slogx.Err(err))
	}
	log.Info("Usecase setup")

	s := gateways.NewServer(ctx, cfg, cases)
	if err := s.Run(ctx); err != nil && !errors.Is(err, http.ErrServerClosed) {
		slogx.WithErr(log, err).Error("error during server shutdown")
	}
}
