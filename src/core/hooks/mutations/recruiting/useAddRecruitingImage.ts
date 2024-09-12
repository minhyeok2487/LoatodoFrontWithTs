import { useMutation } from "@tanstack/react-query";

import * as recruiting from "@core/apis/recruiting.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { AddRecruitingImageResponse } from "@core/types/recruiting";

export default (
  options?: CommonUseMutationOptions<File, AddRecruitingImageResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => recruiting.addRecruitingImage(params),
  });

  return mutation;
};
