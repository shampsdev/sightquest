package route

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
	"github.com/shampsdev/sightquest/server/pkg/utils"
)

// GetRoutes godoc
// @Summary Get all routes
// @Tags route
// @Accept json
// @Produce json
// @Param bought query bool false "Bought filter"
// @Schemes http https
// @Success 200 {array} github_com_shampsdev_sightquest_server_pkg_domain.Route
// @Failure 400
// @Router /route [get]
// @Security ApiKeyAuth
func GetRoutes(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		var bought *bool
		if o := c.Query("bought"); o != "" {
			bought = utils.PtrTo(o == "true")
		}

		routes, err := cases.Route.GetRoutes(middlewares.MustUsecaseCtx(c), bought)
		if ginerr.AbortIfErr(c, err, 400, "failed to get routes") {
			return
		}
		c.JSON(200, routes)
	}
}
