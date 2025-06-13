package game

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases *usecase.Cases) {
	r.Group("/game").Use(middlewares.Auth(cases.Auth)).
		POST("", Create(cases)).
		GET("/id/:id", Get(cases)).
		GET("/latest", Latest(cases))

}
