package rest

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-contrib/pprof"
	"github.com/gin-gonic/gin"
	"github.com/penglongli/gin-metrics/ginmetrics"
	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
	"golang.org/x/sync/errgroup"
)

type Server struct {
	HTTPServer http.Server
	Router     *gin.Engine
}

func NewServer(ctx context.Context, cfg *config.Config, cases *usecase.Cases) *Server {
	setupGinLogging(ctx)
	r := gin.New()
	r.Use(gin.Recovery())

	m := ginmetrics.GetMonitor()
	m.SetMetricPath("/metrics")
	m.Use(r)
	if cfg.Debug {
		pprof.Register(r)
	}

	s := &Server{
		Router: r,
		HTTPServer: http.Server{
			Addr:    fmt.Sprintf(":%d", cfg.Server.Port),
			Handler: r,
		},
	}

	setupRouter(ctx, cfg, s.Router, cases)

	return s
}

func (s *Server) Run(ctx context.Context) error {
	eg := errgroup.Group{}
	eg.Go(func() error {
		return s.HTTPServer.ListenAndServe()
	})

	<-ctx.Done()
	err := s.HTTPServer.Shutdown(ctx)
	return err
}

func setupGinLogging(ctx context.Context) {
	log := slogx.FromCtx(ctx)
	gin.DebugPrintFunc = func(format string, args ...interface{}) {
		log.Debug(fmt.Sprintf(format, args...))
	}
	gin.DebugPrintRouteFunc = func(httpMethod, absolutePath, handlerName string, nuHandlers int) {
		log.Debug(fmt.Sprintf("%-6s %-25s %s (%d handlers)", httpMethod, absolutePath, handlerName, nuHandlers))
	}
}
