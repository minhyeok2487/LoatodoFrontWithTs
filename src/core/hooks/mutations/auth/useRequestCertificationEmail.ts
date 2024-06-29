import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { NoDataResponse } from "@core/types/api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { RequestCertificationEmailRequest } from "@core/types/auth";

export default (
  options?: CommonUseMutationOptions<
    RequestCertificationEmailRequest,
    NoDataResponse
  >
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => authApi.requestCertificationEmail(params),
  });

  return mutation;
};
