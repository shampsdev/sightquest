package route

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// GetRoutes godoc
// @Summary Get all routes
// @Tags routes
// @Accept json
// @Produce json
// @Schemes http https
// @Success 200 {array} domain.Route
// @Failure 400
// @Router /route [get]
func GetRoutes(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		filter := &domain.FilterRoute{}
		
		routes, err := cases.Route.GetRoutes(c, filter)
		if ginerr.AbortIfErr(c, err, 400, "failed to get routes") {
			return
		}
		c.JSON(200, routes)
	}
}
