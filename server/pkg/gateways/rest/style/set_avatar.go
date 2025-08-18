package style

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

type setAvatarRequest struct {
	StyleID string `json:"styleId"`
}

// SetAvatar godoc
// @Summary Set avatar style
// @Tags style
// @Accept json
// @Produce json
// @Param request body setAvatarRequest true "Style ID"
// @Success 200 {object} github_com_shampsdev_sightquest_server_pkg_domain.User
// @Failure 400
// @Router /styles/me/avatar [post]
// @Security ApiKeyAuth
func SetAvatar(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req setAvatarRequest
		if ginerr.AbortIfErr(c, c.ShouldBindJSON(&req), 400, "invalid request") {
			return
		}

		uc := middlewares.MustUsecaseCtx(c)
		if err := cases.Style.SetAvatar(uc, req.StyleID); ginerr.AbortIfErr(c, err, 400, "failed to set avatar style") {
			return
		}

		user, err := cases.User.GetUserByID(c, uc.UserID)
		if ginerr.AbortIfErr(c, err, 400, "failed to get user") {
			return
		}

		c.JSON(200, user)

		c.Status(200)
	}
}
