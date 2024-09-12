import { useMutation } from "@tanstack/react-query";

import * as recruiting from "@core/apis/recruiting.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type {
  AddRecruitingRequest,
  AddRecruitingResponse,
} from "@core/types/recruiting";

export default (
  options?: CommonUseMutationOptions<
    AddRecruitingRequest,
    AddRecruitingResponse
  >
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => recruiting.addRecruiting(params),
  });

  return mutation;
};
