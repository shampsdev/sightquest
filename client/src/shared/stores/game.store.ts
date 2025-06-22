import { create } from "zustand";
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

const initialState: Pick<GameState, "game" | "chatMessages"> = {
  game: null,
  chatMessages: [],
};

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

  const addMessage = (message: ChatMessage) =>
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
    });

  const resetChat = () => {
    set({ chatMessages: [] });
  };

  socket.on("broadcasted", ({ player, data }) => {
    addMessage({ playerId: player.user.id ?? "", data: data });
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
    ...initialState,
    setGame: (game) => set({ game }),
    updateStatus,
    addPlayer,
    removePlayer,
    updatePlayerLocation,
    addMessage,
    resetChat,
  };
});
