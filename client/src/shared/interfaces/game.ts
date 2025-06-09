import { Player } from "./player";
import { User } from "./User";

export interface Game {
  id: string;
  admin: User;
  createdAt: Date;
  finishedAt: Date;
  players: Player[];
}
