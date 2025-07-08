import { Coords } from "./coords";

export interface Point {
  location: Coords;
}

export interface TaskPoint extends Point {
  id: string;
  title: string;
  description: string;
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
