package style

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
	"github.com/shampsdev/sightquest/server/pkg/utils"
)

// GetStyles godoc
// @Summary Get available styles
// @Tags style
// @Accept json
// @Produce json
// @Param type query string false "Style type filter"
// @Param bought query bool false "Bought filter"
// @Success 200 {array} domain.Style
// @Failure 400
// @Router /styles [get]
// @Security ApiKeyAuth
func GetStyles(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		var styleType *domain.StyleType
		if t := c.Query("type"); t != "" {
			styleType = utils.PtrTo(domain.StyleType(t))
		}

		var bought *bool
		if o := c.Query("bought"); o != "" {
			bought = utils.PtrTo(o == "true")
		}

		styles, err := cases.Style.GetStyles(
			middlewares.MustUsecaseCtx(c),
			styleType,
			bought,
		)
		if ginerr.AbortIfErr(c, err, 400, "failed to get styles") {
			return
		}

		c.JSON(200, styles)
	}
}
