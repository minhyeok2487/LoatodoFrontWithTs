import { useMutation } from "@tanstack/react-query";

import * as recruiting from "@core/apis/recruiting.api";
import type { NoDataResponse } from "@core/types/api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { EditRecruitingRequest } from "@core/types/recruiting";

export default (
  options?: CommonUseMutationOptions<EditRecruitingRequest, NoDataResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => recruiting.editRecruiting(params),
  });

  return mutation;
};
