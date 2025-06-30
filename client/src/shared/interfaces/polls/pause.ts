import { Poll, PollData, PollResult } from "./poll";

interface PauseData extends PollData {}

interface PauseResult extends PollResult {}

export interface Pause extends Poll {
  type: "pause";
  data: PauseData;
  result: PauseResult;
}

export const isPause = (poll: Poll): poll is Pause => poll.type === "pause";
