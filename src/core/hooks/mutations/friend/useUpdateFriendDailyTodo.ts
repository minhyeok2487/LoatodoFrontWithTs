import { useMutation } from "@tanstack/react-query";

import * as friendApi from "@core/apis/friend.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character } from "@core/types/character";
import type { UpdateFriendDailyTodoRequest } from "@core/types/friend";

interface Params {
  params: UpdateFriendDailyTodoRequest;
  allCheck: boolean;
}

export default (options?: CommonUseMutationOptions<Params, Character>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (paramObject) => friendApi.updateDailyTodo(paramObject),
  });

  return mutation;
};
