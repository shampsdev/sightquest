package payment

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// GetUserPayments godoc
// @Summary Get user payments
// @Tags payment
// @Accept json
// @Produce json
// @Param limit query int false "Limit"
// @Success 200 {array} github_com_shampsdev_sightquest_server_pkg_domain.Payment
// @Failure 400
// @Router /payment/ [get]
// @Security ApiKeyAuth
func GetUserPayments(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		var limit *int
		if limitStr := c.Query("limit"); limitStr != "" {
			if l, err := strconv.Atoi(limitStr); err == nil {
				limit = &l
			}
		}

		payments, err := cases.Payment.GetUserPayments(middlewares.MustUsecaseCtx(c), limit)
		if ginerr.AbortIfErr(c, err, http.StatusInternalServerError, "failed to get payments") {
			return
		}

		c.JSON(http.StatusOK, payments)
	}
}

// GetPayment godoc
// @Summary Get payment by ID
// @Tags payment
// @Accept json
// @Produce json
// @Param id path string true "Payment ID"
// @Success 200 {object} github_com_shampsdev_sightquest_server_pkg_domain.Payment
// @Failure 400
// @Router /payment/{id} [get]
// @Security ApiKeyAuth
func GetPayment(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		paymentID := c.Param("id")

		payment, err := cases.Payment.GetPayment(c.Request.Context(), paymentID)
		if ginerr.AbortIfErr(c, err, http.StatusNotFound, "payment not found") {
			return
		}

		c.JSON(http.StatusOK, payment)
	}
}
