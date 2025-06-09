import { create } from "zustand";
import { socket } from "@/shared/instances/socket.instance";

interface SocketState {
  isConnected: boolean;
  subscribe: (
    event: string,
    callback: (...args: any[]) => void,
    signal?: AbortSignal
  ) => () => void;
  emit: (event: string, ...args: any[]) => void;
  socket: typeof socket;
}

export const useSocketStore = create<SocketState>((set) => {
  const onConnect = () => {
    console.info("[socket] connected");
    set({ isConnected: true });
  };

  const onDisconnect = () => {
    console.info("[socket] disconnected");
    set({ isConnected: false });
  };

  const onConnectError = (error: Error) => {
    console.error("[socket] connection error:", error);
  };

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);
  socket.on("connect_error", onConnectError);

  return {
    isConnected: socket.connected,
    socket,

    subscribe: (
      event: string,
      callback: (...args: any[]) => void,
      signal?: AbortSignal
    ) => {
      if (signal?.aborted) {
        return () => {};
      }

      const loggingCallback = (data: any) => {
        const shouldLog = process.env.NODE_ENV !== "production";
        if (shouldLog) console.info(`[socket] < ${event}`, data);
        callback(data);
      };

      socket.on(event, loggingCallback);

      const unsubscribe = () => {
        socket.off(event, loggingCallback);
        signal?.removeEventListener("abort", unsubscribe);
      };

      signal?.addEventListener("abort", unsubscribe, { once: true });

      return unsubscribe;
    },

    emit: (event: string, ...args: any[]) => {
      const shouldLog = process.env.NODE_ENV !== "production";
      if (shouldLog) console.info(`[socket] > ${event}`, args);
      socket.emit(event, ...args);
    },
  };
});
