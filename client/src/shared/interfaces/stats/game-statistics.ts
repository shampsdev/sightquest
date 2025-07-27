import { ImageSourcePropType } from "react-native";
import { Route } from "../route";
import { Player } from "../game/player";

export interface GameStatistics {
  players: Player[];
  route?: Route;
  date: Date;
}
