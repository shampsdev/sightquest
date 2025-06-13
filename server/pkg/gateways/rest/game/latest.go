package game

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// Latest godoc
// @Summary Get last N games for a player
// @Tags game
// @Accept json
// @Produce json
// @Schemes http https
// @Security ApiKeyAuth
// @Param limit query int true "Number of games to return"
// @Success 200 {array} domain.Game
// @Failure 400
// @Failure 404
// @Router /game/latest [get]
func Latest(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := middlewares.MustUsecaseCtx(c)
		limitStr := c.Query("limit")
		limit, err := strconv.Atoi(limitStr)
		if err != nil || limit <= 0 {
			ginerr.AbortIfErr(c, nil, 400, "limit must be a positive integer")
			return
		}

		games, err := cases.Game.GetLastGamesByPlayer(ctx, ctx.UserID, limit)
		if ginerr.AbortIfErr(c, err, 404, "failed to get player games") {
			return
		}

		c.JSON(200, games)
	}
}
