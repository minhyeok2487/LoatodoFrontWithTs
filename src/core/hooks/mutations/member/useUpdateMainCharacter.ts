import { useMutation } from "@tanstack/react-query";

import * as memberApi from "@core/apis/member.api";
import type { OkResponse } from "@core/types/api";
import type { UseMutationWithParams } from "@core/types/app";
import type { UpdateMainCharacterRequest } from "@core/types/member";

export default (
  options?: UseMutationWithParams<UpdateMainCharacterRequest, OkResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => memberApi.updateMainCharacter(params),
  });

  return mutation;
};
