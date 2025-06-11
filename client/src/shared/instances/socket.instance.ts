import { Coords } from "../interfaces/coords";
import { Game } from "../interfaces/game";
import { Player } from "../interfaces/player";
import { User } from "../interfaces/user";
import { EventMap, SocketManager } from "../socket/socket-manager";

export interface ServerToClientEvents extends EventMap {
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

export interface ClientToServerEvents extends EventMap {
  auth: ({ token }: { token: string }) => void;
  joinGame: ({ gameId }: { gameId: string }) => void;
  locationUpdate: ({ location }: { location: Coords }) => void;
  broadcast: ({ data }: { data: any }) => void;
  startGame: () => void;
  endGame: () => void;
  leaveGame: () => void;
}

export const socket = new SocketManager<
  ServerToClientEvents,
  ClientToServerEvents
>();
