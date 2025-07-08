import { api } from "../instances/axios.instance";
import { Route } from "../interfaces/route";

export const getRoutes = async (): Promise<Route[]> => {
  const response = await api.get("api/v1/route");
  return response.data;
};
