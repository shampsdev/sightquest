import { useQuery } from "@tanstack/react-query";
import { getGames } from "../game.api";

export const useGames = (limit: number) => {
  return useQuery({
    queryKey: ["games", limit],
    queryFn: () => getGames(limit),
  });
};
