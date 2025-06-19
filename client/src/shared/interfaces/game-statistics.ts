import { ImageSourcePropType } from "react-native";
import { Route } from "./route";

export interface UserStatistic {
  score: number;
  username: string;
  avatar: ImageSourcePropType;
}

export interface GameStatistics {
  membersStatistics: UserStatistic[];
  route: Route;
  date: Date;
}
