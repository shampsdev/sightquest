import * as io from "socket.io-client";
import { SOCKET_URL } from "@/constants";
import { User } from "@/shared/interfaces/user";
import { Game } from "@/shared/interfaces/game";
import { Coords } from "@/shared/interfaces/coords";
import { Player } from "@/shared/interfaces/player";
import { Sock, socket } from "../instances/socket.instance";

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
