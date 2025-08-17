import { api } from "../instances/axios.instance";
import { Route } from "../interfaces/route";

export const getRoutes = async (): Promise<Route[]> => {
  const response = await api.get("api/v1/route");
  return response.data;
};

export const buyRoute = async (routeId: string): Promise<void> => {
  await api.post(`api/v1/route/${routeId}/buy`);
};

export const getMyRoutes = async (): Promise<string[]> => {
  try {
    const response = await api.get<string[]>("api/v1/user/routes");
    return response.data;
  } catch {
    return [];
  }
};
