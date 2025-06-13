import { api } from "../instances/axios.instance";
import { Game } from "../interfaces/game";
import { User } from "../interfaces/user";

export const patchMe = async (token: string, user: User): Promise<User> => {
  const response = await api.patch<User>("api/v1/user/me", user, {
    headers: {
      "X-Api-Token": token,
    },
  });
  return response.data;
};
