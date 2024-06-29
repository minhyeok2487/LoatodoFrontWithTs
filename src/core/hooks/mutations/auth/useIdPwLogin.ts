import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { UseMutationWithParams } from "@core/types/app";
import type { IdPwLoginRequest, IdPwLoginResponse } from "@core/types/auth";

const useIdPwLogin = (
  options?: UseMutationWithParams<IdPwLoginRequest, IdPwLoginResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => authApi.idpwLogin(params),
  });

  return mutation;
};

export default useIdPwLogin;
