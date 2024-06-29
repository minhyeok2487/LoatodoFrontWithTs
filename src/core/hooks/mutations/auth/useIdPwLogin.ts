import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { IdPwLoginRequest, IdPwLoginResponse } from "@core/types/auth";

export default (
  options?: CommonUseMutationOptions<IdPwLoginRequest, IdPwLoginResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => authApi.idpwLogin(params),
  });

  return mutation;
};
