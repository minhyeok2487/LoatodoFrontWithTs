import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import { OkResponse } from "@core/types/api";
import { UseMutationWithParams } from "@core/types/app";
import type { AuthEmailRequest } from "@core/types/auth";

const useAuthEmail = (
  options?: UseMutationWithParams<AuthEmailRequest, OkResponse>
) => {
  const authEmail = useMutation({
    ...options,
    mutationFn: (params) => authApi.authEmail(params),
  });

  return authEmail;
};

export default useAuthEmail;
