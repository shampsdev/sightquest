import { Route } from "./Route";
import { User } from "./User";

export interface GameStatistics {
  members: User[];
  route: Route;
  date: Date;
}
