import { SOCKET_URL } from "@/constants";
import io from "socket.io-client";

export type Sock = any;

const g = globalThis as { __socket__?: Sock };

function createSocket(): Sock {
  const sock = io.connect(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"],
    timeout: 2000,
  });

  if (__DEV__) {
    const originalOnevent = sock.onevent;
    sock.onevent = function (packet: any) {
      const [event, ...args] = packet.data;
      console.info(`[socket] < ${event}`, ...args);
      return originalOnevent.call(this, packet);
    };

    const originalEmit = sock.emit.bind(sock);
    sock.emit = function (ev: string, ...args: any[]) {
      console.info(`[socket] > ${ev}`, ...args);
      return originalEmit.call(this, ev, ...args);
    };
  }

  return sock;
}

export const socket: Sock = g.__socket__ ?? (g.__socket__ = createSocket());
