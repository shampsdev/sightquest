import { useQuery } from "@tanstack/react-query";
import { getRoutes } from "../routes.api";

export const useRoutes = () => {
  return useQuery({
    queryKey: ["routes"],
    queryFn: () => getRoutes(),
  });
};
