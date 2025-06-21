import { useState } from "react";
import { socket } from "../instances/socket.instance";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  socket.onRaw("connect", () => setIsConnected(true));
  socket.onRaw("disconnect", () => setIsConnected(false));

  return {
    emit: socket.emit.bind(socket),
    on: socket.on.bind(socket),
    isConnected,
    reconnect: socket.reconnect.bind(socket),
  };
};
