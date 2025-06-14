import { Game } from "../interfaces/game";
import { api } from "../instances/axios.instance";

export const createGame = async (): Promise<Game> => {
  const response = await api.post<Game>(
    "api/v1/game",
    {}
  );
  return response.data;
};

export const getGame = async (gameId: string): Promise<Game> => {
  const response = await api.get<Game>(`api/v1/game/id/${gameId}`);
  return response.data;
};
