package style

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// GetStyles godoc
// @Summary Get available styles
// @Tags style
// @Accept json
// @Produce json
// @Param type query string false "Style type filter"
// @Success 200 {array} domain.Style
// @Failure 400
// @Router /styles [get]
// @Security ApiKeyAuth
func GetStyles(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		filter := &domain.FilterStyle{}
		if styleType := c.Query("type"); styleType != "" {
			styleTypeVal := domain.StyleType(styleType)
			filter.Type = &styleTypeVal
		}

		styles, err := cases.Style.GetStyles(c, filter)
		if ginerr.AbortIfErr(c, err, 400, "failed to get styles") {
			return
		}

		c.JSON(200, styles)
	}
}
