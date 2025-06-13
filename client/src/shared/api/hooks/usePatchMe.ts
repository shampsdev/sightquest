import { useAuthStore } from "@/shared/stores/auth.store";
import { useMutation } from "@tanstack/react-query";
import { patchMe } from "../patch.api";
import { User } from "@/shared/interfaces/user";

export const usePatchMe = () => {
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: (user: User) => patchMe(token || "", user),
    onError(error, variables, context) {
      console.error(error);
    },
  });
};
