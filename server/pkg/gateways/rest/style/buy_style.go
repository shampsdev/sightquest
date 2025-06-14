package style

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// BuyStyle godoc
// @Summary Buy style
// @Tags style
// @Accept json
// @Produce json
// @Param id path string true "Style ID"
// @Success 200
// @Failure 400
// @Router /styles/id/{id}/buy [post]
// @Security ApiKeyAuth
func BuyStyle(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		styleID := c.Param("id")

		if err := cases.Style.BuyStyle(middlewares.MustUsecaseCtx(c), styleID); ginerr.AbortIfErr(c, err, 400, "failed to buy style") {
			return
		}

		c.Status(200)
	}
}
