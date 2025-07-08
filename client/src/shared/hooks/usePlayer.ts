import { useAuthStore } from "../stores/auth.store";
import { useGameStore } from "../stores/game.store";

export const usePlayer = () => {
  const { game } = useGameStore();
  const { user } = useAuthStore();

  return {
    player: game?.players.find((x) => x.user.id === user?.id),
  };
};
