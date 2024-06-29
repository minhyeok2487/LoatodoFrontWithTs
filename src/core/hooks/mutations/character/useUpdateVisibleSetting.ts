import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateVisibleSettingRequest } from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<UpdateVisibleSettingRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => characterApi.updateVisibleSetting(params),
  });

  return mutation;
};
