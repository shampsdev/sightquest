import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoutes } from "../routes.api";

export const useRoutes = () => {
  const queryClient = useQueryClient();

  const routesQuery = useQuery({
    queryKey: ["routes"],
    queryFn: () => getRoutes(),
  });

  const updateRoutes = () => {
    queryClient.invalidateQueries({ queryKey: ["styles"] });
  };

  return {
    ...routesQuery,
    updateRoutes,
  };
};
