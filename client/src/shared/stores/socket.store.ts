import { create } from "zustand";
import { ServerToClientEvents, socketManager } from "../socket/socket-manager";
import { useAuthStore } from "./auth.store";

interface SocketState {
  isConnected: boolean;
  emit: typeof socketManager.emit;
  subscribe: <K extends keyof ServerToClientEvents>(
    event: K,
    cb: ServerToClientEvents[K],
    signal?: AbortSignal
  ) => () => void;
}

export const useSocketStore = create<SocketState>((set) => {
  socketManager.onRaw("connect", () => set({ isConnected: true }));
  socketManager.onRaw("disconnect", () => set({ isConnected: false }));

  socketManager.connect();
  return {
    isConnected: socketManager.connected,
    emit: socketManager.emit.bind(socketManager),

    subscribe: (event, cb, signal) => {
      if (signal?.aborted) {
        return () => {};
      }

      const off = socketManager.on(event, cb);

      signal?.addEventListener("abort", off, { once: true });

      return off;
    },
  };
});
