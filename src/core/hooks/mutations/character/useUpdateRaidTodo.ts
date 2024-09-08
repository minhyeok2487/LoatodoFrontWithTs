import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character, UpdateRaidTodoRequest } from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<UpdateRaidTodoRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => characterApi.updateRaidTodo(params),
  });

  return mutation;
};
