import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { OkResponse } from "@core/types/api";
import type { UseMutationWithParams } from "@core/types/app";
import type { AuthEmailRequest } from "@core/types/auth";

const useAuthEmail = (
  options?: UseMutationWithParams<AuthEmailRequest, OkResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => authApi.authEmail(params),
  });

  return mutation;
};

export default useAuthEmail;
