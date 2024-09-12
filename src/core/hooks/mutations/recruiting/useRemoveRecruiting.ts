import { useMutation } from "@tanstack/react-query";

import * as recruiting from "@core/apis/recruiting.api";
import type { NoDataResponse } from "@core/types/api";
import type { CommonUseMutationOptions } from "@core/types/app";

export default (options?: CommonUseMutationOptions<number, NoDataResponse>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => recruiting.removeRecruiting(params),
  });

  return mutation;
};
