import { api } from "../instances/axios.instance";
import { User } from "../interfaces/user";
interface AuthResponse {
  user: User;
  token: string;
}

export const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("api/v1/auth/login", {
    username,
    password,
  });

  return response.data;
};

export const register = async (
  email: string,
  username: string,
  password: string,
  name: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("api/v1/auth/register", {
    name,
    email,
    username,
    password,
  });
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("api/v1/user/me");
  return response.data;
};
