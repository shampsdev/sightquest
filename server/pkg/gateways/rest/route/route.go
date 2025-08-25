package route

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases *usecase.Cases) {
	routes := r.Group("/route").Use(middlewares.Auth(cases.Auth))
	{
		routes.GET("", GetRoutes(cases))
		routes.GET("/:id", GetRoute(cases))
	}
}
