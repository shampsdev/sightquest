package game

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/shampsdev/sightquest/server/pkg/domain"
	"github.com/shampsdev/sightquest/server/pkg/repo"
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

	if g.pollFinished() || len(poll.Votes) > 0 {
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
	approved := true
	for _, vote := range poll.Votes {
		if vote.Type == domain.VoteTypeTaskReject {
			approved = false
			break
		}
	}

	if g.pollFinished() || !approved {
		result := domain.PollResult{TaskComplete: &domain.PollResultTaskComplete{
			Approved: approved,
		}}

		var scoreUpdated *event.ScoreUpdated

		if approved {
			pollData := poll.Data.TaskComplete
			player, ok := g.getPlayer(pollData.Player.User.ID)
			if !ok {
				slogx.Error(ctx, "failed to get player", "player_id", pollData.Player.User.ID)
				return
			}

			deltaScore := pollData.Task.Score - 20 + rand.Intn(40)
			player.Score += deltaScore

			scoreUpdated = &event.ScoreUpdated{
				Player:     player,
				Reason:     fmt.Sprintf("Игрок выполнил задание \"%s\"!", pollData.Task.Title),
				Score:      player.Score,
				DeltaScore: deltaScore,
			}

			err := g.completedTaskPointRepo.Create(ctx, &domain.CreateCompletedTaskPoint{
				GameID:   g.game.ID,
				PlayerID: player.User.ID,
				PointID:  pollData.Task.ID,
				Photo:    pollData.Photo,
				Score:    deltaScore,
			})
			if err != nil {
				slogx.Error(ctx, "failed to create completed task point", "err", err)
				return
			}
			completedTaskPoint, err := repo.First(g.completedTaskPointRepo)(ctx, &domain.FilterCompletedTaskPoint{
				GameID:   &g.game.ID,
				PlayerID: &player.User.ID,
				PointID:  &pollData.Task.ID,
			})
			if err != nil {
				slogx.Error(ctx, "failed to get completed task point", "err", err)
				return
			}
			g.game.CompletedTaskPoints = append(g.game.CompletedTaskPoints, completedTaskPoint)
			result.TaskComplete.CompletedTaskPoint = completedTaskPoint
		}

		err := g.finishActive(ctx, result)
		if err != nil {
			slogx.Error(ctx, "failed to finish poll", "poll_id", poll.ID, "err", err)
			return
		}

		if scoreUpdated != nil {
			g.broadcast(*scoreUpdated)
		}

		return
	}
}

func (g *Game) pollFinished() bool {
	if len(g.game.ActivePoll.Votes) == len(g.game.Players) {
		return true
	}
	if g.game.ActivePoll.Duration == nil {
		return false
	}
	return g.game.ActivePoll.CreatedAt.Add(time.Duration(*g.game.ActivePoll.Duration) * time.Second).Before(time.Now().UTC())
}

func (g *Game) finishActive(ctx context.Context, result domain.PollResult) error {
	poll := g.game.ActivePoll
	poll.Result = &result
	poll.FinishedAt = utils.PtrTo(time.Now().UTC())
	err := g.pollRepo.Patch(ctx, poll.ID, &domain.PatchPoll{
		State:      utils.PtrTo(domain.PollStateFinished),
		Result:     &poll.Result,
		FinishedAt: &poll.FinishedAt,
	})
	if err != nil {
		return fmt.Errorf("failed to patch poll: %w", err)
	}

	poll.State = domain.PollStateFinished

	g.broadcast(event.Poll{Poll: poll})
	g.game.ActivePoll = nil
	slogx.Info(ctx, "poll finished", "poll", poll)
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

	err := g.voteRepo.Create(c.Ctx, &domain.CreateVote{
		Type:     t,
		Data:     data,
		PlayerID: c.S.User.ID,
		GameID:   g.game.ID,
		PollID:   g.game.ActivePoll.ID,
	})
	if err != nil {
		return fmt.Errorf("failed to create vote: %w", err)
	}
	vote, err := repo.First(g.voteRepo)(c.Ctx, &domain.FilterVote{
		PlayerID: &c.S.User.ID,
		GameID:   &g.game.ID,
		PollID:   &g.game.ActivePoll.ID,
	})
	if err != nil {
		return fmt.Errorf("failed to get vote: %w", err)
	}

	g.game.ActivePoll.Votes = append(g.game.ActivePoll.Votes, vote)

	g.broadcast(event.Poll{Poll: g.game.ActivePoll})
	return nil
}
