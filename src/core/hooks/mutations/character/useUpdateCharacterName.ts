import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character, UpdateCharacterNameRequest } from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<UpdateCharacterNameRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => characterApi.updateCharacterName(params),
  });

  return mutation;
};
