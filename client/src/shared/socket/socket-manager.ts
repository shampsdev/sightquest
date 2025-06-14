import { SOCKET_URL } from "@/constants";
import io from "socket.io-client";

export type Sock = any;

function createSocket(): Sock {
  const sock = io.connect(SOCKET_URL, {
    autoConnect: true,
    transports: ["websocket"],
    timeout: 2000,
  });

  if (__DEV__) {
    console.info(`[socket] > connecting to ${SOCKET_URL}`);

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

export type EventMap = Record<string, (...args: any[]) => any>;

export class SocketManager<S extends EventMap, C extends EventMap> {
  private sock: Sock;

  constructor() {
    this.sock = createSocket();
  }

  connect() {
    if (!this.sock.connected) this.sock.connect();
  }

  disconnect() {
    this.sock.disconnect();
  }

  reconnect() {
    this.sock.disconnect();
    this.sock.connect();
  }

  on<K extends keyof S>(event: K, cb: S[K], signal?: AbortSignal): () => void {
    this.sock.on(event as string, cb as any);

    const off = () => this.sock.off(event as string, cb as any);

    if (signal) {
      if (signal.aborted) {
        off();
      } else {
        signal.addEventListener("abort", off, { once: true });
      }
    }

    return off;
  }

  emit<K extends keyof C>(event: K, ...args: Parameters<C[K]>) {
    this.sock.emit(event as string, ...args);
  }

  get connected() {
    return this.sock.connected;
  }

  onRaw(event: "connect" | "disconnect", cb: () => void) {
    this.sock.on(event, cb);
    return () => this.sock.off(event, cb);
  }
}
