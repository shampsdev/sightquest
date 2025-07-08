import { useAuthStore } from "@/shared/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { getGame } from "../game.api";

export const useGame = (gameId: string) => {
  return useQuery({
    queryFn: () => getGame(gameId),
    queryKey: [`game/${gameId}`],
    enabled: !!gameId,
  });
};
