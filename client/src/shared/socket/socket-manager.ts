import * as io from "socket.io-client";
import { SOCKET_URL } from "@/constants";
import { User } from "@/shared/interfaces/user";
import { Game } from "@/shared/interfaces/game";
import { Coords } from "@/shared/interfaces/coords";
import { Player } from "@/shared/interfaces/player";

export interface ServerToClientEvents {
  chatMessage: (msg: string) => void;
  authed: ({ user }: { user: User }) => void;
  game: ({ game }: { game: Game }) => void;
  playerJoined: ({ player }: { player: Player }) => void;
  playerLeft: ({ player }: { player: Player }) => void;
  locationUpdated: ({
    player,
    location,
  }: {
    player: Player;
    location: Coords;
  }) => void;
  broadcasted: ({ from, data }: { from: Player; data: any }) => void;
  startGame: () => void;
  endGame: () => void;
  error: ({ error }: { error: string }) => void;
}

export interface ClientToServerEvents {
  auth: ({ token }: { token: string }) => void;
  joinGame: ({ gameId }: { gameId: string }) => void;
  locationUpdate: ({ location }: { location: Coords }) => void;
  broadcast: ({ data }: { data: any }) => void;
  startGame: () => void;
  endGame: () => void;
  leaveGame: () => void;
}

type Sock = any;

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

class SocketManager {
  private constructor(private readonly sock: Sock) {}

  private static _instance?: SocketManager;
  static get instance() {
    return (this._instance ??= new SocketManager(socket));
  }

  connect() {
    if (!this.sock.connected) this.sock.connect();
  }

  disconnect() {
    this.sock.disconnect();
  }

  on<K extends keyof ServerToClientEvents>(
    event: K,
    cb: ServerToClientEvents[K]
  ): () => void {
    this.sock.on(event as string, cb as any);
    return () => this.sock.off(event as string, cb as any);
  }

  emit<K extends keyof ClientToServerEvents>(
    event: K,
    ...args: Parameters<ClientToServerEvents[K]>
  ) {
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

export const socketManager = SocketManager.instance;
