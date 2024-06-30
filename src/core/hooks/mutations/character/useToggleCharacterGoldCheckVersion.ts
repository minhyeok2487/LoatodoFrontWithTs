import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type {
  Character,
  ToggleCharacterGoldCheckVersionRequest,
} from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<
    ToggleCharacterGoldCheckVersionRequest,
    Character
  >
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) =>
      characterApi.toggleCharacterGoldCheckVersion(params),
  });

  return mutation;
};
