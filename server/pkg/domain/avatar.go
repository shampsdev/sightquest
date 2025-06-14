package domain

type Avatar struct {
	ID           string `json:"id"`
	PriceRoubles int    `json:"priceRoubles"`
	Title        string `json:"title"`
	Avatar       string `json:"avatar"`
}

type CreateAvatar struct {
	PriceRoubles int    `json:"priceRoubles"`
	Title        string `json:"title"`
	Avatar       string `json:"avatar"`
}

type PatchAvatar struct {
	PriceRoubles *string `json:"priceRoubles"`
	Title        *string `json:"title"`
	Avatar       *string `json:"avatar"`
}

type FilterAvatar struct {
	ID           *string `json:"id"`
	PriceRoubles *string `json:"priceRoubles"`
}
