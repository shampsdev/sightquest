import { Coords } from "./coords";
import { Role } from "./role";
import { User } from "./user";

export interface Player {
  gameId: string;
  location: Coords;
  role: Role;
  user: User;
  score: number;
}
