import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character, UpdateCharacterRequest } from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<UpdateCharacterRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => characterApi.updateCharacter(params),
  });

  return mutation;
};
