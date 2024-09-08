import { useMutation } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character } from "@core/types/character";
import type { UpdateCharacterMemoRequest } from "@core/types/todo";

export default (
  options?: CommonUseMutationOptions<UpdateCharacterMemoRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateCharacterMemo(params),
  });

  return mutation;
};
