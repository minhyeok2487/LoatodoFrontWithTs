import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateCharacterSettingRequest } from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<UpdateCharacterSettingRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => characterApi.updateCharacterSetting(params),
  });

  return mutation;
};
