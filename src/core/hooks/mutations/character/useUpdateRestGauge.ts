import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character, UpdateRestGaugeRequest } from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<UpdateRestGaugeRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => characterApi.updateRestGauge(params),
  });

  return mutation;
};
