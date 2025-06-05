import { Route } from "./Route";
import { User } from "./User";

export interface UserStatistic {
  score: number;
  username: string;
  avatar: string;
}

export interface GameStatistics {
  membersStatistics: UserStatistic[];
  route: Route;
  date: Date;
  gameId: string;
}
