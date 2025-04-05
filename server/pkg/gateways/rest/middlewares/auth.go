package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
	"github.com/shampsdev/sightquest/server/pkg/usecase/auth"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

func Auth(a *auth.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("X-Api-Token")
		if token == "" {
			c.AbortWithStatusJSON(401, gin.H{"error": "missing token"})
			return
		}
		userID, err := a.ParseToken(token)
		if err != nil {
			slogx.Info(c, "invalid token", slogx.Err(err))
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
			return
		}
		c.Set("user_id", userID)
		c.Next()
	}
}

func MustGetUserID(c *gin.Context) string {
	return c.GetString("user_id")
}

func MustUsecaseCtx(c *gin.Context) *usecase.Context {
	return usecase.NewCtx(c, MustGetUserID(c))
}
