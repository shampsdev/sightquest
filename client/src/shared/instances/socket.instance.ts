import { SOCKET_URL } from "@/constants";
import io from "socket.io-client";

export const socket = io(SOCKET_URL ?? "", {
  autoConnect: true,
  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 2000,
});
