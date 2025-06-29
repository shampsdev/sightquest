import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Game } from "@/shared/interfaces/game";
import { Player } from "../interfaces/player";
import { GameState as GameStatus } from "../interfaces/game-state";
import { socket } from "../instances/socket.instance";
import { Coords } from "../interfaces/coords";

interface ChatMessageGroup {
  playerId: string;
  messages: any[];
}

interface ChatMessage {
  playerId: string;
  data: any;
}

interface GameState {
  game: Game | null;
  chatMessages: ChatMessageGroup[];
  setGame: (game: Game | null) => void;
  updateStatus: (newState: GameStatus) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (userId: string) => void;
  updatePlayerLocation: (userId: string, location: Coords) => void;
  addMessage: (message: ChatMessage) => void;
  resetChat: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      game: null,
      chatMessages: [],
      setGame: (game) => set({ game }),
      updateStatus: (newState) =>
        set((state) => {
          if (!state.game) return {};
          return {
            game: { ...state.game, state: newState },
          };
        }),
      addPlayer: (player) =>
        set((state) => {
          if (!state.game) return {};
          return {
            game: { ...state.game, players: [...state.game.players, player] },
          };
        }),
      removePlayer: (userId) =>
        set((state) => {
          if (!state.game) return {};
          return {
            game: {
              ...state.game,
              players: state.game.players.filter((p) => p.user?.id !== userId),
            },
          };
        }),
      updatePlayerLocation: (userId, coords) =>
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
        }),
      addMessage: (message) =>
        set((state) => {
          const lastGroup = state.chatMessages[state.chatMessages.length - 1];
          if (lastGroup && lastGroup.playerId === message.playerId) {
            const updatedMessages = [...state.chatMessages];
            updatedMessages[updatedMessages.length - 1] = {
              ...lastGroup,
              messages: [...lastGroup.messages, message.data],
            };
            return { chatMessages: updatedMessages };
          }
          return {
            chatMessages: [
              ...state.chatMessages,
              { playerId: message.playerId, messages: [message.data] },
            ],
          };
        }),
      resetChat: () => set({ chatMessages: [] }),
    }),
    {
      name: "game-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        game: state.game ? { id: state.game.id } : null,
      }),
    }
  )
);

// Подписка на события socket.io
const {
  setGame,
  updateStatus,
  addPlayer,
  removePlayer,
  updatePlayerLocation,
  addMessage,
} = useGameStore.getState();

socket.on("broadcasted", ({ player, data }) => {
  addMessage({ playerId: player.user.id ?? "", data: data });
});
socket.on("game", ({ game }) => {
  setGame(game);
});
socket.on("startGame", () => {
  updateStatus("game");
});
socket.on("endGame", () => {
  updateStatus("finished");
  useGameStore.setState({ game: null, chatMessages: [] });
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
