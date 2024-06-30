import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { ToggleOptainableGoldRaidRequest } from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<ToggleOptainableGoldRaidRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => characterApi.toggleOptainableGoldRaid(params),
  });

  return mutation;
};
