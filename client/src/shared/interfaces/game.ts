import { GameState } from "./game-state";
import { Player } from "./player";
import { User } from "./user";

export interface Game {
  id: string;
  admin: User;
  createdAt: string;
  finishedAt: string;
  players: Player[];
  state: GameState;
}
