package user

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases *usecase.Cases) {
	r.Group("/user").Use(middlewares.Auth(cases.Auth)).
		PATCH("/me", Patch(cases)).
		GET("/me", Get(cases))
}
