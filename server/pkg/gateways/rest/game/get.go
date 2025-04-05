package game

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// Get godoc
// @Summary Get game by id
// @Tags game
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Game ID"
// @Success 200 {object} domain.GameFull
// @Failure 400
// @Router /game/id/{id} [get]
// @Security ApiKeyAuth
func Get(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		game, err := cases.Game.GetGameByID(middlewares.MustUsecaseCtx(c), id)
		if err != nil {
			c.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, game)
	}
}
