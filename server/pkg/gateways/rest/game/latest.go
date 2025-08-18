package game

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
	"github.com/shampsdev/sightquest/server/pkg/utils"
)

// Latest godoc
// @Summary Get last N games for a player
// @Tags game
// @Accept json
// @Produce json
// @Schemes http https
// @Security ApiKeyAuth
// @Param limit query int true "Number of games to return"
// @Param state query domain.GameState false "Game state"
// @Success 200 {array} github_com_shampsdev_sightquest_server_pkg_domain.Game
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

		var state *domain.GameState
		if stateStr := c.Query("state"); stateStr != "" {
			state = utils.PtrTo(domain.GameState(stateStr))
		}

		games, err := cases.Game.GetLastGamesByPlayer(ctx, ctx.UserID, limit, state)
		if ginerr.AbortIfErr(c, err, 404, "failed to get player games") {
			return
		}

		c.JSON(200, games)
	}
}
