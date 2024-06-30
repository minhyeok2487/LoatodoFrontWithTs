import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type {
  Character,
  UpdateWeeklyRaidTodoRequest,
} from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<UpdateWeeklyRaidTodoRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => characterApi.updateWeeklyRaidTodo(params),
  });

  return mutation;
};
