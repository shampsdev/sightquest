import { Coords } from "../interfaces/coords";
import { Game } from "../interfaces/game/game";
import { Player } from "../interfaces/game/player";
import { User } from "../interfaces/user";
import { EventMap, SocketManager } from "../custom/socket-manager";
import { Route } from "../interfaces/route";
import { Poll } from "../interfaces/polls/poll";

export interface ServerToClientEvents extends EventMap {
  authed: ({ user }: { user: User }) => void;
  game: ({ game }: { game: Game }) => void;
  settedRoute: ({ route }: { route: Route }) => void;
  chatMessage: (msg: string) => void;
  playerJoined: ({ player }: { player: Player }) => void;
  playerLeft: ({ player }: { player: Player }) => void;
  locationUpdated: ({
    player,
    location,
  }: {
    player: Player;
    location: Coords;
  }) => void;
  scoreUpdated: ({ player, score }: { player: Player; score: number }) => void;
  broadcasted: ({ player, data }: { player: Player; data: any }) => void;
  startGame: () => void;
  endGame: () => void;
  error: ({ error }: { error: string }) => void;
  poll: ({ poll }: { poll: Poll }) => void;
}

export interface ClientToServerEvents extends EventMap {
  auth: ({ token }: { token: string }) => void;
  joinGame: ({ gameId }: { gameId: string }) => void;
  locationUpdate: ({ location }: { location: Coords }) => void;
  setRoute: ({ routeId }: { routeId: string }) => void;
  broadcast: ({ data }: { data: any }) => void;
  startGame: () => void;
  endGame: () => void;
  leaveGame: () => void;
  pause: ({ duration }: { duration: number }) => void;
  unpause: () => void;
}

export const socket = new SocketManager<
  ServerToClientEvents,
  ClientToServerEvents
>();
