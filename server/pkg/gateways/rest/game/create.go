package game

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// Create godoc
// @Summary Create game
// @Tags game
// @Accept json
// @Produce json
// @Schemes http https
// @Success 200 {object} domain.GameFull
// @Failure 400
// @Router /game [post]
// @Security ApiKeyAuth
func Create(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		game, err := cases.Game.CreateGame(middlewares.MustUsecaseCtx(c))
		if ginerr.AbortIfErr(c, err, 400, "failed to create game") {
			return
		}
		c.JSON(200, game)
	}
}
