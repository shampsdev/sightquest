import { Coords } from "../interfaces/coords";
import { Game } from "../interfaces/game/game";
import { Player } from "../interfaces/game/player";
import { User } from "../interfaces/user";
import { EventMap, SocketManager } from "../custom/socket-manager";
import { ModalContext } from "../providers/modal-provider";
import React from "react";
import { Route } from "../interfaces/route";
import { Poll } from "../interfaces/polls/poll";
import { Role } from "../interfaces/game/role";

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
  roleUpdated: ({ player, role }: { player: Player; role: Role }) => void;
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
  taskComplete: ({
    taskId,
    photo,
    pollDuration,
  }: {
    taskId: string;
    photo: string;
    pollDuration: number;
  }) => void;
  playerCatch: ({
    playerId,
    photo,
    pollDuration,
  }: {
    playerId: string;
    photo: string;
    pollDuration: number;
  }) => void;
  pause: ({ pollDuration }: { pollDuration: number }) => void;
  unpause: () => void;
}

export const socket = new SocketManager<
  ServerToClientEvents,
  ClientToServerEvents
>();

// Show server-sent errors in a modal instead of crashing
const ReactModalErrorBridge: React.FC = () => {
  const { setModalOpen } = React.useContext(ModalContext);
  React.useEffect(() => {
    const handler = ({ error }: { error: string }) => {
      setModalOpen({
        title: "Ошибка",
        subtitle: error,
        buttons: [
          {
            text: "Ок",
            type: "primary",
            onClick: () => setModalOpen(false),
          },
        ],
      });
    };
    const off = socket.on("error", handler as any);
    return off;
  }, [setModalOpen]);
  return null;
};

export const SocketErrorModalBridge = React.memo(ReactModalErrorBridge);
