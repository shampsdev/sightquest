import { useAuthStore } from "@/shared/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { getGame } from "../game.api";

export const useGame = (gameId: string) => {
  const { token } = useAuthStore();

  return useQuery({
    queryFn: () => getGame(gameId, token || ""),
    queryKey: [`game/${gameId}`],
  });
};
