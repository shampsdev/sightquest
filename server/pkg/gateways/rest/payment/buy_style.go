package payment

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

type BuyStyleRequest struct {
	ReturnURL string `json:"returnUrl" binding:"required"`
}

// BuyStyle godoc
// @Summary Buy style with payment
// @Tags payment
// @Accept json
// @Produce json
// @Param id path string true "Style ID"
// @Param request body BuyStyleRequest true "Buy style request"
// @Success 200 {object} github_com_shampsdev_sightquest_server_pkg_domain.Payment
// @Failure 400
// @Router /payment/style/{id} [post]
// @Security ApiKeyAuth
func BuyStyle(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		styleID := c.Param("id")

		var req BuyStyleRequest
		if err := c.ShouldBindJSON(&req); ginerr.AbortIfErr(c, err, http.StatusBadRequest, "invalid request") {
			return
		}

		payment, err := cases.Payment.BuyStyle(middlewares.MustUsecaseCtx(c), styleID, req.ReturnURL)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to create payment") {
			return
		}

		c.JSON(http.StatusOK, payment)
	}
}
