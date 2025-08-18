package usecore

import (
	"context"
	"fmt"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
	"github.com/shampsdev/sightquest/server/pkg/usecase/payment"
)

type Payment struct {
	yookassa      *payment.YooKassa
	userRouteRepo repo.UserRoute
	userStyleRepo repo.UserStyle
}

func NewPayment(yookassa *payment.YooKassa, userRouteRepo repo.UserRoute, userStyleRepo repo.UserStyle) *Payment {
	return &Payment{
		yookassa:      yookassa,
		userRouteRepo: userRouteRepo,
		userStyleRepo: userStyleRepo,
	}
}

func (p *Payment) CreatePayment(ctx *Context, req *domain.CreatePaymentRequest) (*domain.Payment, error) {
	return p.yookassa.CreatePayment(ctx, ctx.UserID, req)
}

func (p *Payment) GetPayment(ctx context.Context, paymentID string) (*domain.Payment, error) {
	return p.yookassa.GetPayment(ctx, paymentID)
}

func (p *Payment) GetUserPayments(ctx *Context, limit *int) ([]*domain.Payment, error) {
	return p.yookassa.GetUserPayments(ctx, ctx.UserID, limit)
}

func (p *Payment) ConfirmPayment(ctx context.Context, yooKassaID string) error {
	return p.yookassa.ConfirmPayment(ctx, yooKassaID)
}

// BuyRoute - покупка маршрута с оплатой
func (p *Payment) BuyRoute(ctx *Context, routeID, returnURL string) (*domain.Payment, error) {
	req := &domain.CreatePaymentRequest{
		Type:      domain.PaymentTypeRoute,
		ItemID:    routeID,
		ReturnURL: returnURL,
	}
	return p.CreatePayment(ctx, req)
}

// BuyStyle - покупка стиля с оплатой
func (p *Payment) BuyStyle(ctx *Context, styleID, returnURL string) (*domain.Payment, error) {
	req := &domain.CreatePaymentRequest{
		Type:      domain.PaymentTypeStyle,
		ItemID:    styleID,
		ReturnURL: returnURL,
	}
	return p.CreatePayment(ctx, req)
}

// GrantPurchasedItem - предоставляет купленный товар пользователю после успешной оплаты
func (p *Payment) GrantPurchasedItem(ctx context.Context, userID string, itemType domain.PaymentType, itemID string) error {
	switch itemType {
	case domain.PaymentTypeRoute:
		err := p.userRouteRepo.Create(ctx, userID, itemID)
		if err != nil {
			return fmt.Errorf("failed to grant route to user: %w", err)
		}
	case domain.PaymentTypeStyle:
		err := p.userStyleRepo.Create(ctx, userID, itemID)
		if err != nil {
			return fmt.Errorf("failed to grant style to user: %w", err)
		}
	default:
		return fmt.Errorf("unknown payment type: %s", itemType)
	}
	return nil
}
