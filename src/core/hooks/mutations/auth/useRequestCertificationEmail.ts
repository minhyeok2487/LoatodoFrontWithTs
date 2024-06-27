import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { OkResponse } from "@core/types/api";
import type { UseMutationWithParams } from "@core/types/app";
import type { RequestCertificationEmailRequest } from "@core/types/auth";

const useRequestCertificationEmail = (
  options?: UseMutationWithParams<RequestCertificationEmailRequest, OkResponse>
) => {
  const requestCertificationEmail = useMutation({
    ...options,
    mutationFn: (params) => authApi.requestCertificationEmail(params),
  });

  return requestCertificationEmail;
};

export default useRequestCertificationEmail;
