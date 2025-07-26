import { CompletedTaskPoint } from "../game/completed-task-point";
import { Player } from "../game/player";
import { Poll, PollData, PollResult } from "./poll";

interface PlayerPollData extends PollData {
  playerCatch: {
    runner: Player;
    catchedBy: Player;
    photo: string;
  };
}

interface PlayerPollResult extends PollResult {
  playerCatch: {
    runner: Player;
    catchedBy: Player;
    photo: string;
  };
}

export interface PlayerPoll extends Poll {
  type: "playerCatch";
  data: PlayerPollData;
  result: PlayerPollResult;
}

export const isPlayerPoll = (poll: Poll): poll is PlayerPoll =>
  poll.type === "playerCatch";
