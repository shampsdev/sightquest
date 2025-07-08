import { CompletedTaskPoint } from "../game/completed-task-point";
import { Poll, PollData, PollResult } from "./poll";

interface TaskPollData extends PollData {}

interface TaskPollResult extends PollResult {
  taskComplete: {
    approved: boolean;
    completedTaskPoint: CompletedTaskPoint;
  };
}

export interface TaskPoll extends Poll {
  type: "taskComplete";
  data: TaskPollData;
  result: TaskPollResult;
}

export const isTaskPoll = (poll: Poll): poll is TaskPoll =>
  poll.type === "taskComplete";
