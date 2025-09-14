import { api } from "../instances/axios.instance";
import { Route } from "../interfaces/route";
import { PaymentResult } from "../interfaces/styles/payment";

export const getRoutes = async (): Promise<Route[]> => {
  const response = await api.get("api/v1/route");
  return response.data;
};

export const buyRoute = async (routeId: string): Promise<PaymentResult> => {
  let result = await api.post<PaymentResult>(
    `api/v1/payment/route/${routeId}`,
    {
      returnUrl: "sightquest://main/shop",
    }
  );
  return result.data;
};

export const getMyRoutes = async (): Promise<string[]> => {
  try {
    const response = await api.get<string[]>("api/v1/user/routes");
    return response.data;
  } catch {
    return [];
  }
};
