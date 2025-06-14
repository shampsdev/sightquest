import { api } from "../instances/axios.instance";
import { Game } from "../interfaces/game";
import { User } from "../interfaces/user";

export const patchMe = async (user: User): Promise<User> => {
  const response = await api.patch<User>("api/v1/user/me", user);
  return response.data;
};
