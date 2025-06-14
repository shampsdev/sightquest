import { api } from "../instances/axios.instance";
import { Style } from "../interfaces/styles";

export const getStyles = async (): Promise<Style[]> => {
  const response = await api.get<Style[]>("api/v1/styles");
  return response.data;
};

export const setAvatar = async (styleId: string): Promise<void> => {
  const response = await api.post("api/v1/styles/me/avatar", {
    styleId,
  });
  return response.data;
};

export const getMyStyles = async (): Promise<Style[]> => {
  const response = await api.get<Style[]>("api/v1/styles/me");
  return response.data;
};
