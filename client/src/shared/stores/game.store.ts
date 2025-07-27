import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";

// MVC -> Model (store) -> View -> Controller

import { Game } from "@/shared/interfaces/game/game";
import { Player } from "../interfaces/game/player";
import { GameState as GameStatus } from "../interfaces/game/game-state";
import { Coords } from "../interfaces/coords";
import { Route } from "../interfaces/route";
import { socket } from "../instances/socket.instance";
import { Poll } from "../interfaces/polls/poll";
import { CompletedTaskPoint } from "../interfaces/game/completed-task-point";
import { Role } from "../interfaces/game/role";

interface ChatMessageGroup {
  playerId: string;
  messages: any[];
}
interface ChatMessage {
  playerId: string;
  data: any;
}

interface StoreState {
  game: Game | null;

  chatMessages: ChatMessageGroup[];
  unreadMessages: boolean;

  /* actions */
  setGame: (g: Game | null) => void;
  updateStatus: (s: GameStatus) => void;
  addPlayer: (p: Player) => void;
  removePlayer: (userId: string) => void;
  updatePlayerLocation: (userId: string, loc: Coords) => void;
  updatePlayerScore: (userId: string, score: number) => void;
  updatePlayerRole: (userId: string, role: Role) => void;
  addMessage: (msg: ChatMessage) => void;
  setUndreadMessages: (unreadMessages: boolean) => void;
  resetChat: () => void;
  setRoute: (route: Route | null) => void;
  setPoll: (poll: Poll | null) => void;

  addCompletedTaskPoint: (taskPoint: CompletedTaskPoint) => void;
}

export const useGameStore = create<StoreState>()(
  immer(
    persist(
      (set, get) => ({
        game: null,

        chatMessages: [],
        unreadMessages: false,

        setGame: (game) => set({ game }),

        setPoll: (poll) =>
          set((state) => {
            if (!state.game) return;
            state.game.activePoll = poll;
          }),

        updateStatus: (newStatus) =>
          set((state) => {
            if (state.game) state.game.state = newStatus;
          }),

        addPlayer: (player) =>
          set((state) => {
            state.game?.players.push(player);
          }),

        removePlayer: (userId) =>
          set((state) => {
            if (!state.game) return;
            state.game.players = state.game.players.filter(
              (p) => p.user.id !== userId
            );
          }),

        updatePlayerLocation: (userId, loc) =>
          set((state) => {
            const player = state.game?.players.find(
              (p) => p.user.id === userId
            );
            if (player) player.location = loc;
          }),

        updatePlayerScore: (userId, score) =>
          set((state) => {
            const player = state.game?.players.find(
              (p) => p.user.id === userId
            );
            if (player) player.score = score;
          }),
        updatePlayerRole: (userId, role) =>
          set((state) => {
            const player = state.game?.players.find(
              (p) => p.user.id === userId
            );
            if (player) player.role = role;
          }),

        addMessage: ({ playerId, data }) =>
          set((state) => {
            const last = state.chatMessages.at(-1);
            if (last && last.playerId === playerId) {
              last.messages.push(data);
            } else {
              state.chatMessages.push({
                playerId,
                messages: [data],
              });
            }
            state.unreadMessages = true;
          }),

        setUndreadMessages: (unreadMessages) =>
          set((state) => {
            state.unreadMessages = unreadMessages;
          }),

        addCompletedTaskPoint: (taskPoint) =>
          set((state) => {
            state.game?.completedTaskPoints.push(taskPoint);
          }),

        resetChat: () =>
          set((state) => {
            state.chatMessages = [];
          }),

        setRoute: (route) =>
          set((state) => {
            if (state.game) state.game.route = route;
          }),
      }),
      {
        name: "game-storage",
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (s) => ({ game: s.game ? { id: s.game.id } : null }),
      }
    )
  )
);

// Подписка на события socket.io
const {
  setGame,
  updateStatus,
  addPlayer,
  removePlayer,
  updatePlayerLocation,
  updatePlayerScore,
  updatePlayerRole,
  addMessage,
  setRoute,
  setPoll,
} = useGameStore.getState();

socket.on("poll", ({ poll }) => {
  setPoll(poll);
});
socket.on("settedRoute", ({ route }) => {
  setRoute(route);
});
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
socket.on("scoreUpdated", ({ player, score }) => {
  updatePlayerScore(player.user.id!, score);
});
socket.on("playerRoleUpdated", ({ player, role }) => {
  updatePlayerRole(player.user.id!, role);
});
