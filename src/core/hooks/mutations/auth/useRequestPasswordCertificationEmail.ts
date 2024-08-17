import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { RequestPasswordCertificationEmailRequest } from "@core/types/auth";

export default (
  options?: CommonUseMutationOptions<RequestPasswordCertificationEmailRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => authApi.requestPasswordCertificationEmail(params),
  });

  return mutation;
};
