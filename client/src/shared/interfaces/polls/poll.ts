import { Vote } from "./vote";

export interface Poll {
  id: string;
  gameId: string;
  type: "pause" | "taskComplete" | "playerCatch";
  state: "active" | "finished";
  duration: number;
  createdAt: string;
  data: PollData;
  result: PollResult;
  votes?: Vote[];
}

export interface PollData {}

export interface PollResult {}
