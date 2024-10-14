import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";

export default (options?: CommonUseMutationOptions<string | undefined>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (friendUsername) =>
      characterApi.refreshCharacters(friendUsername),
  });

  return mutation;
};
