import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateChallengeRequest } from "@core/types/character";

export default (options?: CommonUseMutationOptions<UpdateChallengeRequest>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => characterApi.updateChallenge(params),
  });

  return mutation;
};
