package pg

import "github.com/shampsdev/sightquest/server/pkg/repo"

var (
	_ repo.User   = &User{}
	_ repo.Game   = &Game{}
	_ repo.Player = &Player{}
	_ repo.Poll   = &Poll{}
	_ repo.Vote   = &Vote{}
)
