package payment

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases *usecase.Cases) {
	paymentGroup := r.Group("/payment").Use(middlewares.Auth(cases.Auth))
	{
		paymentGroup.POST("/route/:id", BuyRoute(cases))
		paymentGroup.POST("/style/:id", BuyStyle(cases))
		paymentGroup.GET("/", GetUserPayments(cases))
		paymentGroup.GET("/:id", GetPayment(cases))
	}

	// Webhook для подтверждения платежей (без аутентификации)
	r.POST("/webhook/yookassa", YooKassaWebhook(cases))
}
