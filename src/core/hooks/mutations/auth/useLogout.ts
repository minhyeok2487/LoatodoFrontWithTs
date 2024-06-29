import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { OkResponse } from "@core/types/api";
import type { CommonUseMutationOptions } from "@core/types/app";

export default (options?: CommonUseMutationOptions<void, OkResponse>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: () => authApi.logout(),
  });

  return mutation;
};
