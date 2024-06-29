import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { OkResponse } from "@core/types/api";
import type { UseMutationWithParams } from "@core/types/app";
import type { RequestCertificationEmailRequest } from "@core/types/auth";

export default (
  options?: UseMutationWithParams<RequestCertificationEmailRequest, OkResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => authApi.requestCertificationEmail(params),
  });

  return mutation;
};
