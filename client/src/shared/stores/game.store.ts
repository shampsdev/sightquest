import { create } from "zustand";
import { Game } from "@/shared/interfaces/game";
import { Player } from "../interfaces/player";
import { GameState as GameStatus } from "../interfaces/game-state";
import { socket } from "../instances/socket.instance";
import { Coords } from "../interfaces/coords";

interface GameState {
  game: Game | null;
  setGame: (game: Game) => void;
  updateStatus: (newState: GameStatus) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (userId: string) => void;
  updatePlayerLocation: (userId: string, location: Coords) => void;
}

export const useGameStore = create<GameState>((set, get) => {
  const updateStatus = (newState: GameStatus) =>
    set((state) => {
      if (!state.game) return {};
      return {
        game: {
          ...state.game,
          state: newState,
        },
      };
    });

  const addPlayer = (player: Player) =>
    set((state) => {
      if (!state.game) return {};
      return {
        game: {
          ...state.game,
          players: [...state.game.players, player],
        },
      };
    });

  const removePlayer = (userId: string) =>
    set((state) => {
      if (!state.game) return {};
      return {
        game: {
          ...state.game,
          players: state.game.players.filter((p) => p.user?.id !== userId),
        },
      };
    });

  const updatePlayerLocation = (userId: string, coords: Coords) =>
    set((state) => {
      if (!state.game) return {};
      return {
        game: {
          ...state.game,
          players: state.game.players.map((p) =>
            p.user.id === userId ? { ...p, location: coords } : p
          ),
        },
      };
    });

  socket.on("game", ({ game }) => {
    set({ game });
  });

  socket.on("startGame", () => {
    updateStatus("game");
  });

  socket.on("endGame", () => {
    updateStatus("finished");
  });

  socket.on("playerJoined", ({ player }) => {
    addPlayer(player);
  });

  socket.on("playerLeft", ({ player }) => {
    removePlayer(player.user.id ?? "");
  });

  socket.on("locationUpdated", ({ player, location }) => {
    updatePlayerLocation(player.user.id!, location);
  });

  return {
    game: null,
    setGame: (game) => set({ game }),
    updateStatus: updateStatus,
    addPlayer: addPlayer,
    removePlayer: removePlayer,
    updatePlayerLocation: updatePlayerLocation,
  };
});
