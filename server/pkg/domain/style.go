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
}

type CreateStyle struct {
	PriceRoubles int       `json:"priceRoubles"`
	Title        string    `json:"title"`
	Style        any       `json:"style"`
	Type         StyleType `json:"type"`
}

type PatchStyle struct {
	PriceRoubles *string    `json:"priceRoubles"`
	Title        *string    `json:"title"`
	Style        *any       `json:"style"`
	Type         *StyleType `json:"type"`
}

type FilterStyle struct {
	ID           *string    `json:"id"`
	PriceRoubles *string    `json:"priceRoubles"`
	Type         *StyleType `json:"type"`
	UserID       *string    `json:"userId"`
}
