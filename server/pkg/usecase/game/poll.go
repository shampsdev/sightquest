package game

import (
	"context"
	"fmt"
	"time"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/usecase/event"
	"github.com/shampsdev/sightquest/server/pkg/usecase/state"
	"github.com/shampsdev/sightquest/server/pkg/utils"
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
		g.checkActivePollPause(ctx)
	case domain.PollTypeTaskComplete:
		g.checkActivePollTaskComplete(ctx)
	}
}

func (g *Game) checkActivePollPause(ctx context.Context) {
	poll := g.game.ActivePoll

	if g.pollExpired() || len(poll.Votes) > 0 {
		result := domain.PollResult{Pause: &domain.PollResultPause{}}
		if len(poll.Votes) > 0 {
			player, ok := g.getPlayer(poll.Votes[0].PlayerID)
			if !ok {
				slogx.Error(ctx, "failed to get player", "player_id", poll.Votes[0].PlayerID)
				return
			}
			result.Pause.UnpausedBy = player
		}
		err := g.finishActive(ctx, result)
		if err != nil {
			slogx.Error(ctx, "failed to finish poll", "poll_id", poll.ID, "err", err)
			return
		}
		return
	}
}

func (g *Game) checkActivePollTaskComplete(ctx context.Context) {
	poll := g.game.ActivePoll
	approved := false
	for _, vote := range poll.Votes {
		if vote.Type == domain.VoteTypeTaskApprove {
			approved = true
			break
		}
	}

	if g.pollExpired() || !approved {
		result := domain.PollResult{TaskComplete: &domain.PollResultTaskComplete{
			Approved: approved,
		}}

		err := g.finishActive(ctx, result)
		if err != nil {
			slogx.Error(ctx, "failed to finish poll", "poll_id", poll.ID, "err", err)
			return
		}
		return
	}
}

func (g *Game) pollExpired() bool {
	if g.game.ActivePoll.Duration == nil {
		return false
	}
	return g.game.ActivePoll.CreatedAt.Add(time.Duration(*g.game.ActivePoll.Duration) * time.Second).Before(time.Now().UTC())
}

func (g *Game) finishActive(ctx context.Context, result domain.PollResult) error {
	poll := g.game.ActivePoll
	poll.Result = &result
	err := g.pollRepo.Patch(ctx, poll.ID, &domain.PatchPoll{
		State:  utils.PtrTo(domain.PollStateFinished),
		Result: &poll.Result,
	})
	if err != nil {
		return fmt.Errorf("failed to patch poll: %w", err)
	}

	poll.State = domain.PollStateFinished

	g.broadcast(event.Poll{Poll: poll})
	g.game.ActivePoll = nil
	slogx.Info(ctx, "poll finished", "poll_id", poll.ID)
	return nil
}

func (g *Game) broadcast(ev state.Event) {
	g.server.ForEach(g.game.ID, func(c *state.Context[*PlayerState]) {
		c.Emit(ev)
	})
}

func (g *Game) voteInActive(c Context, t domain.VoteType, data *domain.VoteData) error {
	alreadyVoted := false
	for _, vote := range g.game.ActivePoll.Votes {
		if vote.PlayerID == c.S.User.ID {
			alreadyVoted = true
			break
		}
	}
	if alreadyVoted {
		return fmt.Errorf("already voted")
	}

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
	g.broadcast(event.Poll{Poll: g.game.ActivePoll})
	return nil
}
