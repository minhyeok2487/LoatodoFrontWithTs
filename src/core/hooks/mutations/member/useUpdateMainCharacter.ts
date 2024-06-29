import { useMutation } from "@tanstack/react-query";

import * as memberApi from "@core/apis/member.api";
import type { NoDataResponse } from "@core/types/api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateMainCharacterRequest } from "@core/types/member";

export default (
  options?: CommonUseMutationOptions<UpdateMainCharacterRequest, NoDataResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => memberApi.updateMainCharacter(params),
  });

  return mutation;
};
