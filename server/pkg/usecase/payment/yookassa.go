package payment

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/rvinnie/yookassa-sdk-go/yookassa"
	yoocommon "github.com/rvinnie/yookassa-sdk-go/yookassa/common"
	yoopayment "github.com/rvinnie/yookassa-sdk-go/yookassa/payment"
	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type YooKassa struct {
	client        *yookassa.Client
	paymentRepo   repo.Payment
	routeRepo     repo.Route
	styleRepo     repo.Style
	userRouteRepo repo.UserRoute
	userStyleRepo repo.UserStyle
}

func NewYooKassa(cfg *config.YooKassaConfig, paymentRepo repo.Payment, routeRepo repo.Route, styleRepo repo.Style, userRouteRepo repo.UserRoute, userStyleRepo repo.UserStyle) *YooKassa {
	client := yookassa.NewClient(cfg.ShopID, cfg.SecretKey)
	return &YooKassa{
		client:        client,
		paymentRepo:   paymentRepo,
		routeRepo:     routeRepo,
		styleRepo:     styleRepo,
		userRouteRepo: userRouteRepo,
		userStyleRepo: userStyleRepo,
	}
}

func (s *YooKassa) CreatePayment(ctx context.Context, userID string, req *domain.CreatePaymentRequest) (*domain.Payment, error) {
	// Получаем информацию о товаре
	item, err := s.getPaymentItem(ctx, req.Type, req.ItemID)
	if err != nil {
		return nil, fmt.Errorf("failed to get payment item: %w", err)
	}

	// Создаем платеж в YooKassa
	paymentHandler := yookassa.NewPaymentHandler(s.client)
	yooPayment, err := paymentHandler.CreatePayment(&yoopayment.Payment{
		Amount: &yoocommon.Amount{
			Value:    fmt.Sprintf("%.2f", float64(item.PriceRoubles)),
			Currency: "RUB",
		},
		PaymentMethod: yoopayment.PaymentMethodType("bank_card"),
		Confirmation: yoopayment.Redirect{
			Type:      yoopayment.TypeRedirect,
			ReturnURL: req.ReturnURL,
		},
		Description: fmt.Sprintf("Покупка: %s", item.Title),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create YooKassa payment: %w", err)
	}

	// Создаем запись в нашей БД
	payment := &domain.Payment{
		ID:              uuid.New().String(),
		UserID:          userID,
		YooKassaID:      yooPayment.ID,
		Type:            req.Type,
		ItemID:          req.ItemID,
		AmountRoubles:   item.PriceRoubles,
		Status:          yoopayment.Pending,
		ConfirmationURL: getConfirmationURL(yooPayment),
	}

	err = s.paymentRepo.Create(ctx, payment)
	if err != nil {
		return nil, fmt.Errorf("failed to save payment: %w", err)
	}

	return payment, nil
}

func (s *YooKassa) GetPayment(ctx context.Context, paymentID string) (*domain.Payment, error) {
	payments, err := s.paymentRepo.Filter(ctx, &domain.FilterPayment{ID: &paymentID})
	if err != nil {
		return nil, fmt.Errorf("failed to get payment: %w", err)
	}
	if len(payments) == 0 {
		return nil, fmt.Errorf("payment not found")
	}
	return payments[0], nil
}

func (s *YooKassa) GetUserPayments(ctx context.Context, userID string, limit *int) ([]*domain.Payment, error) {
	filter := &domain.FilterPayment{
		UserID:              &userID,
		SortByCreatedAtDesc: true,
	}
	if limit != nil {
		filter.Limit = limit
	}

	return s.paymentRepo.Filter(ctx, filter)
}

func (s *YooKassa) ConfirmPayment(ctx context.Context, yooKassaID string) error {
	// Получаем информацию о платеже из YooKassa
	paymentHandler := yookassa.NewPaymentHandler(s.client)
	yooPayment, err := paymentHandler.FindPayment(yooKassaID)
	if err != nil {
		return fmt.Errorf("failed to get YooKassa payment: %w", err)
	}

	// Обновляем статус в нашей БД
	err = s.paymentRepo.Patch(ctx, "", &domain.PatchPayment{
		Status: &yooPayment.Status,
	})
	if err != nil {
		return fmt.Errorf("failed to update payment status: %w", err)
	}

	// Если платеж успешен, добавляем товар пользователю
	if yooPayment.Status == yoopayment.Succeeded {
		payments, err := s.paymentRepo.Filter(ctx, &domain.FilterPayment{YooKassaID: &yooKassaID})
		if err != nil {
			return fmt.Errorf("failed to get payment: %w", err)
		}
		if len(payments) == 0 {
			return fmt.Errorf("payment not found")
		}

		payment := payments[0]
		err = s.grantItemToUser(ctx, payment.UserID, payment.Type, payment.ItemID)
		if err != nil {
			return fmt.Errorf("failed to grant item to user: %w", err)
		}
	}

	return nil
}

func (s *YooKassa) getPaymentItem(ctx context.Context, itemType domain.PaymentType, itemID string) (*domain.PaymentItem, error) {
	switch itemType {
	case domain.PaymentTypeRoute:
		routes, err := s.routeRepo.Filter(ctx, &domain.FilterRoute{ID: &itemID})
		if err != nil {
			return nil, err
		}
		if len(routes) == 0 {
			return nil, fmt.Errorf("route not found")
		}
		route := routes[0]
		return &domain.PaymentItem{
			ID:           route.ID,
			Type:         domain.PaymentTypeRoute,
			Title:        route.Title,
			PriceRoubles: route.PriceRoubles,
		}, nil

	case domain.PaymentTypeStyle:
		styles, err := s.styleRepo.Filter(ctx, &domain.FilterStyle{ID: &itemID})
		if err != nil {
			return nil, err
		}
		if len(styles) == 0 {
			return nil, fmt.Errorf("style not found")
		}
		style := styles[0]
		return &domain.PaymentItem{
			ID:           style.ID,
			Type:         domain.PaymentTypeStyle,
			Title:        style.Title,
			PriceRoubles: style.PriceRoubles,
		}, nil

	default:
		return nil, fmt.Errorf("unknown payment type: %s", itemType)
	}
}

func (s *YooKassa) grantItemToUser(ctx context.Context, userID string, itemType domain.PaymentType, itemID string) error {
	switch itemType {
	case domain.PaymentTypeRoute:
		err := s.userRouteRepo.Create(ctx, userID, itemID)
		if err != nil {
			return fmt.Errorf("failed to grant route to user: %w", err)
		}
	case domain.PaymentTypeStyle:
		err := s.userStyleRepo.Create(ctx, userID, itemID)
		if err != nil {
			return fmt.Errorf("failed to grant style to user: %w", err)
		}
	default:
		return fmt.Errorf("unknown payment type: %s", itemType)
	}
	return nil
}

func getConfirmationURL(payment *yoopayment.Payment) *string {
	if payment.Confirmation != nil {
		if redirect, ok := payment.Confirmation.(yoopayment.Redirect); ok {
			return &redirect.ConfirmationURL
		} else if m, ok := payment.Confirmation.(map[string]any); ok {
			if url, ok := m["confirmation_url"].(string); ok {
				return &url
			}
		}
	}
	return nil
}
