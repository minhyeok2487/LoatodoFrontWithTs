import { useMutation } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character } from "@core/types/character";
import type { ToggleGoldVersionRequeest } from "@core/types/todo";

export default (
  options?: CommonUseMutationOptions<ToggleGoldVersionRequeest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.toggleGoldVersion(params),
  });

  return mutation;
};
