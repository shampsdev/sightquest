package domain

import (
	"time"

	yoopayment "github.com/rvinnie/yookassa-sdk-go/yookassa/payment"
)

type PaymentType string

const (
	PaymentTypeRoute PaymentType = "route"
	PaymentTypeStyle PaymentType = "style"
)

type Payment struct {
	ID              string            `json:"id"`
	UserID          string            `json:"userId"`
	YooKassaID      string            `json:"yooKassaId"`
	Type            PaymentType       `json:"type"`
	ItemID          string            `json:"itemId"`
	AmountRoubles   int               `json:"amountRoubles"`
	Status          yoopayment.Status `json:"status"`
	ConfirmationURL *string           `json:"confirmationUrl,omitempty"`
	CreatedAt       time.Time         `json:"createdAt"`
}

type CreatePaymentRequest struct {
	Type      PaymentType `json:"type"`
	ItemID    string      `json:"itemId"`
	ReturnURL string      `json:"returnUrl"`
}

type PatchPayment struct {
	Status          *yoopayment.Status `json:"status"`
	YooKassaID      *string            `json:"yooKassaId"`
	ConfirmationURL *string            `json:"confirmationUrl"`
}

type FilterPayment struct {
	ID         *string            `json:"id"`
	UserID     *string            `json:"userId"`
	YooKassaID *string            `json:"yooKassaId"`
	Type       *PaymentType       `json:"type"`
	ItemID     *string            `json:"itemId"`
	Status     *yoopayment.Status `json:"status"`
	Limit      *int               `json:"limit"`

	SortByCreatedAtDesc bool `json:"sortByCreatedAtDesc"`
}

// PaymentItem represents the item being purchased
type PaymentItem struct {
	ID           string      `json:"id"`
	Type         PaymentType `json:"type"`
	Title        string      `json:"title"`
	PriceRoubles int         `json:"priceRoubles"`
}
