package rest

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/docs"
	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/auth"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/game"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func setupRouter(ctx context.Context, _ *config.Config, r *gin.Engine, cases *usecase.Cases) {
	r.HandleMethodNotAllowed = true
	r.Use(middlewares.AllowOrigin())
	r.Use(middlewares.InjectLogger(ctx))

	v1 := r.Group("/api/v1")
	v1.Use(middlewares.Logger())
	docs.SwaggerInfo.BasePath = "/api/v1"
	v1.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	{
		auth.Setup(v1, cases)
		game.Setup(v1, cases)
	}
}
