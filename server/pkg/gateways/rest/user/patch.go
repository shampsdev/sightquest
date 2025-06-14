package user

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// Patch godoc
// @Summary Patch me
// @Tags user
// @Accept json
// @Produce json
// @Schemes http https
// @Param user body domain.PatchUser true "User"
// @Success 200 {object} domain.User
// @Failure 400
// @Router /user/me [patch]
// @Security ApiKeyAuth
func Patch(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		patchUser := &domain.PatchUser{}
		if err := c.ShouldBindJSON(patchUser); err != nil {
			ginerr.AbortIfErr(c, err, 400, "failed to bind json")
			return
		}

		user, err := cases.User.PatchUser(middlewares.MustUsecaseCtx(c), patchUser)
		if ginerr.AbortIfErr(c, err, 400, "failed to patch user") {
			return
		}
		c.JSON(200, user)
	}
}
