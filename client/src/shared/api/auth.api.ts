import { api } from "./axios.instance";

interface AuthResponse {
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
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("api/v1/auth/register", {
    email,
    username,
    password,
  });
  return response.data;
};
