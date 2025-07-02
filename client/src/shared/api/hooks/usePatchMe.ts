import { useMutation } from "@tanstack/react-query";
import { patchMe } from "../patch.api";
import { User } from "@/shared/interfaces/user";
import { logger } from '@/shared/instances/logger.instance';

export const usePatchMe = () => {
  return useMutation({
    mutationFn: (user: User) => patchMe(user),
    onError(error, variables, context) {
      logger.error("ui", error);
    },
  });
};
