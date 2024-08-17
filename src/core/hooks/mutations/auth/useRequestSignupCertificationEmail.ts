import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { RequestSignupCertificationEmailRequest } from "@core/types/auth";

export default (
  options?: CommonUseMutationOptions<RequestSignupCertificationEmailRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => authApi.requestSignupCertificationEmail(params),
  });

  return mutation;
};
