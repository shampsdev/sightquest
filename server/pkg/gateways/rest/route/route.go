package route

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases *usecase.Cases) {
	routes := r.Group("/route")
	{
		routes.GET("", GetRoutes(cases))
		routes.GET("/:id", GetRoute(cases))
		routes.GET("/:id/buy", BuyRoute(cases))
	}
}
