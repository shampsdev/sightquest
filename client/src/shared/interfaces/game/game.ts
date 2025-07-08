import { GameState } from "./game-state";
import { Player } from "./player";
import { User } from "../user";
import { Route } from '../route';
import { Poll } from '../polls/poll';

export interface Game {
  id: string;
  admin: User;
  createdAt: string;
  finishedAt: string;
  players: Player[];
  state: GameState;
  activePoll: Poll | null;
  route: Route | null;
}
