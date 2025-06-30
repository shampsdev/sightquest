import { Coords } from "./coords";

export interface TaskPoint {
  id: string;
  title: string;
  description: string;
  location: Coords;
  score: number;
  task: string;
}

export interface Route {
  id: string;
  title: string;
  description: string;
  priceRoubles: number;
  taskPoints: TaskPoint[];
}
