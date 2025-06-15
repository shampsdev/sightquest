import { StyleType } from "@/shared/interfaces/styles";
import { getStyles } from "../styles.api";
import { useQuery } from "@tanstack/react-query";

export const useStyles = (params: { type?: StyleType; bought?: boolean }) => {
  return useQuery({
    queryFn: () => getStyles(params),
    queryKey: ["styles", params.type ?? null, params.bought ?? null],
  });
};
