import { GameState } from "./game-state";
import { Player } from "./player";
import { User } from "../user";
import { Route } from "../route";
import { Poll } from "../polls/poll";
import { CompletedTaskPoint } from "./completed-task-point";

export interface Game {
  id: string;
  admin: User;
  createdAt: string;
  finishedAt: string;
  players: Player[];
  state: GameState;
  activePoll: Poll | null;
  route: Route | null; // we know that these will not be null if game is not lobby
  completedTaskPoints: CompletedTaskPoint[];
}
