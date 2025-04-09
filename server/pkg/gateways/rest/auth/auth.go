package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases *usecase.Cases) {
	r.Group("/auth").
		POST("/register", Register(cases)).
		POST("/login", Login(cases)).
		POST("/verify", Verify(cases))
}
