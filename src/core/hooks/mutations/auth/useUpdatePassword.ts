import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdatePasswordRequest } from "@core/types/auth";

export default (options?: CommonUseMutationOptions<UpdatePasswordRequest>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => authApi.updatePassword(params),
  });

  return mutation;
};
