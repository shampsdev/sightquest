package payment

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

type BuyRouteRequest struct {
	ReturnURL string `json:"returnUrl" binding:"required"`
}

// BuyRoute godoc
// @Summary Buy route with payment
// @Tags payment
// @Accept json
// @Produce json
// @Param id path string true "Route ID"
// @Param request body BuyRouteRequest true "Buy route request"
// @Success 200 {object} github_com_shampsdev_sightquest_server_pkg_domain.Payment
// @Failure 400
// @Router /payment/route/{id} [post]
// @Security ApiKeyAuth
func BuyRoute(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		routeID := c.Param("id")

		var req BuyRouteRequest
		if err := c.ShouldBindJSON(&req); ginerr.AbortIfErr(c, err, http.StatusBadRequest, "invalid request") {
			return
		}

		payment, err := cases.Payment.BuyRoute(middlewares.MustUsecaseCtx(c), routeID, req.ReturnURL)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to create payment") {
			return
		}

		c.JSON(http.StatusOK, payment)
	}
}
