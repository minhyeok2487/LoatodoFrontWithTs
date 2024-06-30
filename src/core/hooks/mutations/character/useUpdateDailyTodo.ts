import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character, UpdateDailyTodoRequest } from "@core/types/character";

interface Params {
  params: UpdateDailyTodoRequest;
  allCheck: boolean;
}

export default (options?: CommonUseMutationOptions<Params, Character>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (paramObject) => characterApi.updateDailyTodo(paramObject),
  });

  return mutation;
};
