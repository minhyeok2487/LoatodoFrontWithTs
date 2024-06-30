import { useMutation } from "@tanstack/react-query";

import * as friendApi from "@core/apis/friend.api";
import type { UpdateWeeklyTodoAction } from "@core/types/api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character } from "@core/types/character";
import type { UpdateFriendWeeklyTodoRequest } from "@core/types/friend";

interface Params {
  params: UpdateFriendWeeklyTodoRequest;
  action: UpdateWeeklyTodoAction;
}

export default (options?: CommonUseMutationOptions<Params, Character>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (paramObject) => friendApi.updateWeeklyTodo(paramObject),
  });

  return mutation;
};
