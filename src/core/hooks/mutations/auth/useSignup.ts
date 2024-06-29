import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { SignupRequest, SignupResponse } from "@core/types/auth";

export default (
  options?: CommonUseMutationOptions<SignupRequest, SignupResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => authApi.signup(params),
  });

  return mutation;
};
