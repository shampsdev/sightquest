import { useAuthStore } from "@/shared/stores/auth.store";
import { createGame } from "../game.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Game } from "@/shared/interfaces/game";

export const useCreateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createGame(),
    onSuccess: (game: Game) => {
      queryClient.invalidateQueries({ queryKey: [`game/${game.id}`] });
    },
  });
};
