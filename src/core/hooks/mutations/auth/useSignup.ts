import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { UseMutationWithParams } from "@core/types/app";
import type { SignupRequest, SignupResponse } from "@core/types/auth";

const useSignup = (
  options?: UseMutationWithParams<SignupRequest, SignupResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => authApi.signup(params),
  });

  return mutation;
};

export default useSignup;
