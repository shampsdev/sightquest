import { create } from "zustand";
import { Game } from "@/shared/interfaces/game";
import { socketManager } from "../socket/socket-manager";

interface GameState {
  game: Game | null;
  setGame: (game: Game) => void;
}
export const useGameStore = create<GameState>((set) => {
  socketManager.on("joinGame", ({ game }) => {
    set({ game });
    console.log(game);
  });

  socketManager.on("startGame", ({ game }) => {
    set({ game });
    console.log(game);
  });

  socketManager.on("endGame", () => {
    set({ game: null });
    console.log("game ended, state reset");
  });

  return {
    game: null,
    setGame: (game) => set({ game }),
  };
});
