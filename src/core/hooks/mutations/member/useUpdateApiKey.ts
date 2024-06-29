import { useMutation } from "@tanstack/react-query";

import * as memberApi from "@core/apis/member.api";
import type { NoDataResponse } from "@core/types/api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateApiKeyRequest } from "@core/types/member";

export default (
  options?: CommonUseMutationOptions<UpdateApiKeyRequest, NoDataResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => memberApi.updateApikey(params),
  });

  return mutation;
};
