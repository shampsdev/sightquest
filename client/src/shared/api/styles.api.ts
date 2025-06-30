import { api } from "../instances/axios.instance";
import { Style, StyleType } from "../interfaces/styles/styles";

export const getStyles = async (params: {
  type?: StyleType;
  bought?: boolean;
}): Promise<Style[]> => {
  const response = await api.get<Style[]>("api/v1/styles", { params });
  return response.data;
};

export const buyStyle = async (styleId: string) => {
  const response = await api.post(`api/v1/styles/id/${styleId}/buy`, {
    styleId,
  });
  return response.data;
};

export const setAvatar = async (styleId: string): Promise<void> => {
  const response = await api.post("api/v1/styles/me/avatar", {
    styleId,
  });
  return response.data;
};
