package pg

import "github.com/shampsdev/sightquest/server/pkg/repo"

var (
	_ repo.User = &User{}
	_ repo.Game = &Game{}
)
