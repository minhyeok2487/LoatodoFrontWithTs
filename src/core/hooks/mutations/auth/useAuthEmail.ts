import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { NoDataResponse } from "@core/types/api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { AuthEmailRequest } from "@core/types/auth";

export default (
  options?: CommonUseMutationOptions<AuthEmailRequest, NoDataResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => authApi.authEmail(params),
  });

  return mutation;
};
