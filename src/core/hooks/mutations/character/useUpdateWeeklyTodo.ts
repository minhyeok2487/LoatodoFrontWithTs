import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { UpdateWeeklyTodoAction } from "@core/types/api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character, UpdateWeeklyTodoRequest } from "@core/types/character";

interface Params {
  params: UpdateWeeklyTodoRequest;
  action: UpdateWeeklyTodoAction;
}

export default (options?: CommonUseMutationOptions<Params, Character>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (paramObject) => characterApi.updateWeeklyTodo(paramObject),
  });

  return mutation;
};
