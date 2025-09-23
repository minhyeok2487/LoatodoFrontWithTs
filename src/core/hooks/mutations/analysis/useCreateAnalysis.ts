import { useMutation } from "@tanstack/react-query";

import * as analysisApi from "@core/apis/analysis.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Analysis } from "@core/types/analysis";

export default (options?: CommonUseMutationOptions<Analysis>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => analysisApi.createAnalysis(params),
  });

  return mutation;
};
