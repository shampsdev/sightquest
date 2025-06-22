import { useMutation } from "@tanstack/react-query";
import { patchMe } from "../patch.api";
import { User } from "@/shared/interfaces/user";

export const usePatchMe = () => {
  return useMutation({
    mutationFn: (user: User) => patchMe(user),
    onError(error, variables, context) {
      console.error(error);
    },
  });
};
