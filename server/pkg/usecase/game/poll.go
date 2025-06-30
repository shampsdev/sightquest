package game

import (
	"context"
	"fmt"
	"time"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"
	"github.com/shampsdev/sightquest/server/pkg/usecase/state"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

func (g *Game) pollObserver(ctx context.Context) {
	observeInterval := 1 * time.Second
	ticker := time.NewTicker(observeInterval)
	defer ticker.Stop()

loop:
	for {
		select {
		case <-ctx.Done():
			break loop
		case <-ticker.C:
			g.checkActivePoll(ctx)
		}
	}

	slogx.Info(ctx, "poll observer stopped")
}

func (g *Game) checkActivePoll(ctx context.Context) {
	g.lock.Lock()
	defer g.lock.Unlock()

	activePoll := g.game.ActivePoll
	if activePoll == nil {
		return
	}

	switch activePoll.Type {
	case domain.PollTypePause:
		g.checkActivePollPause(ctx, activePoll)
	case domain.PollTypeTaskCompleted:
	}
}

func (g *Game) checkActivePollPause(ctx context.Context, poll *domain.Poll) {
	if poll.CreatedAt.Add(time.Duration(*poll.Duration) * time.Second).Before(time.Now()) {
		g.game.ActivePoll = nil
		g.broadcast(event.Unpaused{})
		slogx.Info(ctx, "poll finished", "poll_id", poll.ID)
	}
}

func (g *Game) broadcast(ev state.Event) {
	g.server.ForEach(g.game.ID, func(c *state.Context[*PlayerState]) {
		c.Emit(ev)
	})
}

func (g *Game) voteInActive(c Context, t domain.VoteType, data *domain.VoteData) error {
	vote := &domain.Vote{
		Type:     t,
		Data:     data,
		PlayerID: c.S.User.ID,
		GameID:   g.game.ID,
		PollID:   g.game.ActivePoll.ID,
	}

	g.game.ActivePoll.Votes = append(g.game.ActivePoll.Votes, vote)

	err := g.voteRepo.Create(c.Ctx, &domain.CreateVote{
		Type:     vote.Type,
		Data:     vote.Data,
		PlayerID: vote.PlayerID,
		GameID:   vote.GameID,
		PollID:   vote.PollID,
	})
	if err != nil {
		return fmt.Errorf("failed to create vote: %w", err)
	}
	return nil
}
