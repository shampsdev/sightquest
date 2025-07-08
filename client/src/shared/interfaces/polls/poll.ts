export interface Poll {
  id: string;
  gameId: string;
  type: "pause" | "taskCompleted";
  state: "active" | "finished";
  duration: number;
  createdAt: string;
  data: PollData;
  result: PollResult;
}

export interface PollData {}

export interface PollResult {}

