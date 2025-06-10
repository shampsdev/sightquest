import { create } from "zustand";
import { Game } from "@/shared/interfaces/game";

interface GameState {
  game: Game;
}

export const useGameStore = create<GameState>();
