import { AxiosResponse } from "axios";
import { Game } from "../interfaces/game";
import { api } from "../instances/axios.instance";

export const createGame = async (token: string): Promise<Game> => {
  const response = await api.post<Game>(
    "api/v1/game",
    {},
    {
      headers: {
        "X-Api-Token": token,
      },
    }
  );
  return response.data;
};

export const getGame = async (gameId: string, token: string): Promise<Game> => {
  const response = await api.get<Game>(`api/v1/game/${gameId}`, {
    headers: {
      "X-Api-Key": token,
    },
  });
  return response.data;
};
