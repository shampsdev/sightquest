package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// Verify godoc
// @Summary Verify token
// @Tags auth
// @Accept json
// @Param token body wrapToken true "token"
// @Produce json
// @Schemes http https
// @Success 200 {object} domain.User
// @Failure 400
// @Router /auth/verify [post]
func Verify(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		t := &wrapToken{}
		err := c.ShouldBindJSON(t)
		if ginerr.AbortIfErr(c, err, 400, "failed to bind json") {
			return
		}
		userID, err := cases.Auth.ParseToken(t.Token)
		if ginerr.AbortIfErr(c, err, 400, "failed to parse token") {
			return
		}

		user, err := cases.User.GetUserByID(c, userID)
		if ginerr.AbortIfErr(c, err, 400, "failed to get user") {
			return
		}
		c.JSON(200, user)
	}
}
