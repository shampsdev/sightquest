package domain

type StyleType string

const (
	StyleTypeAvatar StyleType = "avatar"
)

type Style struct {
	ID           string    `json:"id"`
	PriceRoubles int       `json:"priceRoubles"`
	Title        string    `json:"title"`
	Style        any       `json:"style"`
	Type         StyleType `json:"type"`

	Bought *bool `json:"bought,omitempty"`
}

type CreateStyle struct {
	PriceRoubles int       `json:"priceRoubles"`
	Title        string    `json:"title"`
	Style        any       `json:"style"`
	Type         StyleType `json:"type"`
}

type PatchStyle struct {
	PriceRoubles *int       `json:"priceRoubles"`
	Title        *string    `json:"title"`
	Style        *any       `json:"style"`
	Type         *StyleType `json:"type"`
}

type FilterStyle struct {
	ID           *string    `json:"id"`
	UserID       *string    `json:"userId"`
	Bought       *bool      `json:"bought"`
	PriceRoubles *int       `json:"priceRoubles"`
	Type         *StyleType `json:"type"`
}
