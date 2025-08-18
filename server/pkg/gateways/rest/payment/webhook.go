package payment

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	yoopayment "github.com/rvinnie/yookassa-sdk-go/yookassa/payment"
	yoowebhook "github.com/rvinnie/yookassa-sdk-go/yookassa/webhook"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

// YooKassaWebhook godoc
// @Summary YooKassa webhook handler
// @Tags payment
// @Accept json
// @Produce json
// @Param webhook body yoowebhook.WebhookEvent true "Webhook event"
// @Success 200
// @Failure 400
// @Router /webhook/yookassa [post]
func YooKassaWebhook(cases *usecase.Cases) gin.HandlerFunc {
	return func(c *gin.Context) {
		var webhookEvent yoowebhook.WebhookEvent[yoopayment.Payment]
		if err := json.NewDecoder(c.Request.Body).Decode(&webhookEvent); ginerr.AbortIfErr(c, err, http.StatusBadRequest, "invalid webhook data") {
			return
		}

		// Обрабатываем только события успешных платежей
		slog.Info("webhook event", "event", webhookEvent)
		if webhookEvent.Event == yoowebhook.EventPaymentSucceeded || webhookEvent.Event == yoowebhook.EventPaymentCanceled {
			if webhookEvent.Object.ID != "" {
				err := cases.Payment.ConfirmPayment(c.Request.Context(), webhookEvent.Object.ID)
				if ginerr.AbortIfErr(c, err, http.StatusInternalServerError, "failed to process payment") {
					return
				}
			}
		}

		// Возвращаем 200 OK для подтверждения получения webhook
		c.Status(http.StatusOK)
	}
}
