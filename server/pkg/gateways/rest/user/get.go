package user

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// Get godoc
// @Summary Get me
// @Tags user
// @Accept json
// @Produce json
// @Schemes http https
// @Success 200 {object} domain.User
// @Failure 400
// @Router /user/me [get]
// @Security ApiKeyAuth
func Get(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := cases.User.GetUserByID(c, middlewares.MustUsecaseCtx(c).UserID)
		if ginerr.AbortIfErr(c, err, 400, "failed to get user") {
			return
		}
		c.JSON(200, user)
	}
}
