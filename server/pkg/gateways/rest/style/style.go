package style

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases *usecase.Cases) {
	r.Group("/styles").Use(middlewares.Auth(cases.Auth)).
		POST("/id/:id/buy", BuyStyle(cases)).
		GET("", GetStyles(cases)).
		POST("/me/avatar", SetAvatar(cases))
}
