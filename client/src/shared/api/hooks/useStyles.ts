import { Style, StyleType } from "@/shared/interfaces/styles/styles";
import { buyStyle, getStyles } from "../styles.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useStyles = (params: { type?: StyleType; bought?: boolean }) => {
  const queryClient = useQueryClient();

  const stylesQuery = useQuery<Style[]>({
    queryKey: ["styles", params.type ?? null, params.bought ?? null],
    queryFn: () => getStyles(params),
  });

  const buyMutation = useMutation({
    mutationFn: (styleId: string) => buyStyle(styleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["styles"] });
    },
  });

  const getStyle = (styleId: string) => {
    return stylesQuery.data?.find((x) => x.id == styleId);
  };

  return {
    ...stylesQuery,
    getStyle,
    buyStyle: buyMutation.mutateAsync,
    isBuying: buyMutation.isPending,
  };
};
