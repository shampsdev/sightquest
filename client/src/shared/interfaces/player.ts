import { Coords } from "./coords";
import { Role } from "./role";
import { User } from "./User";

export interface Player {
  gameId: string;
  location: Coords;
  role: Role;
  user: User;
  score: number;
}
