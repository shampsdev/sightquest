import { Route } from "./route";

export interface UserStatistic {
  score: number;
  username: string;
  avatar: string;
}

export interface GameStatistics {
  membersStatistics: UserStatistic[];
  route: Route;
  date: Date;
}
