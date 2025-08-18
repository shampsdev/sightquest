package route

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// GetRoute godoc
// @Summary Get route by ID
// @Tags route
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Route ID"
// @Success 200 {object} github_com_shampsdev_sightquest_server_pkg_domain.Route
// @Failure 400
// @Failure 404
// @Router /route/{id} [get]
func GetRoute(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			ginerr.AbortIfErr(c, nil, 400, "route id is required")
			return
		}

		route, err := cases.Route.GetRouteByID(c, id)
		if ginerr.AbortIfErr(c, err, 404, "route not found") {
			return
		}
		c.JSON(200, route)
	}
}
