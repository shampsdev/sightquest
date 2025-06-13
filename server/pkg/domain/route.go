package domain

type Route struct {
	ID           string      `json:"id"`
	Title        string      `json:"title"`
	Description  string      `json:"description"`
	PriceRoubles int         `json:"priceRoubles"`
	TaskPoints   []TaskPoint `json:"taskPoints"`
}

type TaskPoint struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Task        string     `json:"task"`
	Location    Coordinate `json:"location"`
	Score       int        `json:"score"`
}

type CreateRoute struct {
	Title        string   `json:"title"`
	Description  string   `json:"description"`
	PriceRoubles int      `json:"priceRoubles"`
	TaskPointIDs []string `json:"taskPointIds"`
}

type PatchRoute struct {
	Title        *string   `json:"title"`
	Description  *string   `json:"description"`
	PriceRoubles *int      `json:"priceRoubles"`
	TaskPointIDs *[]string `json:"taskPointIds"`
}

type FilterRoute struct {
	ID               *string `json:"id"`
	IncludeTaskPoints bool   `json:"includeTaskPoints"`
}

type CreateTaskPoint struct {
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Task        string     `json:"task"`
	Location    Coordinate `json:"location"`
	Score       int        `json:"score"`
}

type PatchTaskPoint struct {
	Title       *string     `json:"title"`
	Description *string     `json:"description"`
	Task        *string     `json:"task"`
	Location    *Coordinate `json:"location"`
	Score       *int        `json:"score"`
}

type FilterTaskPoint struct {
	ID      *string `json:"id"`
	RouteID *string `json:"routeId"`
}
