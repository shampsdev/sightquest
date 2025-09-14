import { api } from "../instances/axios.instance";
import { PaymentResult } from "../interfaces/styles/payment";
import { Style, StyleType } from "../interfaces/styles/styles";

export const getStyles = async (params: {
  type?: StyleType;
  bought?: boolean;
}): Promise<Style[]> => {
  const response = await api.get<Style[]>("api/v1/styles", { params });
  return response.data;
};

export const buyStyle = async (styleId: string): Promise<PaymentResult> => {
  const response = await api.post(`api/v1/payment/style/${styleId}`, {
    returnUrl: "sightquest://main/shop",
  });
  return response.data;
};

export const setAvatar = async (styleId: string): Promise<void> => {
  const response = await api.post("api/v1/styles/me/avatar", {
    styleId,
  });
  return response.data;
};
