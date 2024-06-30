import { useMutation } from "@tanstack/react-query";

import * as friendApi from "@core/apis/friend.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character } from "@core/types/character";
import type { SaveFriendCharactersSortRequest } from "@core/types/friend";

export default (
  options?: CommonUseMutationOptions<
    SaveFriendCharactersSortRequest,
    Character[]
  >
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => friendApi.saveCharactersSort(params),
  });

  return mutation;
};
