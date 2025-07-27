package route

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// BuyRoute godoc
// @Summary Buy route
// @Tags route
// @Accept json
// @Produce json
// @Param id path string true "Route ID"
// @Success 200
// @Failure 400
// @Router /route/{id}/buy [post]
// @Security ApiKeyAuth
func BuyRoute(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		routeID := c.Param("id")

		if err := cases.Route.BuyRoute(middlewares.MustUsecaseCtx(c), routeID); ginerr.AbortIfErr(c, err, 400, "failed to buy route") {
			return
		}

		c.Status(200)
	}
}
