// hooks/useSocketEvents.ts
import { useEffect } from "react";
import { Game } from "../interfaces/game";
import { Player } from "../interfaces/player";
import { User } from "../interfaces/user";
import { useSocketStore } from "../stores/socket.store";

export function useSocketEvents({
  onAuthed,
  onJoinGame,
  onPlayerJoined,
  onStartGame,
  onLocationUpdate,
  onEndGame,
  onError,
  onChatMessage,
  onHeartBeat,
}: {
  onAuthed: (u: User) => void;
  onJoinGame: (g: Game) => void;
  onPlayerJoined: (g: Game) => void;
  onStartGame: (g: Game) => void;
  onLocationUpdate: (p: Player) => void;
  onEndGame: () => void;
  onError: (err: string) => void;
  onChatMessage: (msg: string) => void;
  onHeartBeat: (ts: number) => void;
}) {
  const subscribe = useSocketStore((s) => s.subscribe);
  const emit = useSocketStore((s) => s.emit);

  useEffect(() => {
    const ctrl = new AbortController();
    const offList = [
      subscribe("authed", onAuthed, ctrl.signal),
      subscribe("joinGame", onJoinGame, ctrl.signal),
      subscribe("playerJoined", onPlayerJoined, ctrl.signal),
      subscribe("startGame", onStartGame, ctrl.signal),
      subscribe("locationUpdate", onLocationUpdate, ctrl.signal),
      subscribe("endGame", onEndGame, ctrl.signal),
      subscribe("error", onError, ctrl.signal),
      subscribe("chatMessage", onChatMessage, ctrl.signal),
      subscribe("heartBeat", onHeartBeat, ctrl.signal),
    ];

    // При монтировании можно инициировать авторизацию/джоин
    emit("auth", "JWT_TOKEN_…");
    emit("joinGame", "game-123");

    return () => {
      ctrl.abort();
      offList.forEach((off) => off());
    };
  }, [
    subscribe,
    emit,
    onAuthed,
    onJoinGame,
    onPlayerJoined,
    onStartGame,
    onLocationUpdate,
    onEndGame,
    onError,
    onChatMessage,
    onHeartBeat,
  ]);
}
