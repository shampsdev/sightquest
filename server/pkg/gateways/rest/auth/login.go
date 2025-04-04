package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// Login godoc
// @Summary Login user
// @Tags auth
// @Accept json
// @Param user body domain.UserCredentials true "User"
// @Produce json
// @Schemes http https
// @Success 200 {object} wrapToken
// @Failure 400
// @Router /auth/login [post]
func Login(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		creds := &domain.UserCredentials{}
		err := c.ShouldBindJSON(creds)
		if ginerr.AbortIfErr(c, err, 400, "failed to bind json") {
			return
		}
		token, err := cases.Auth.Login(c, creds)
		if ginerr.AbortIfErr(c, err, 400, "failed to login user") {
			return
		}
		c.JSON(200, wrapToken{token})
	}
}
