import { useMutation } from "@tanstack/react-query";

import * as friendApi from "@core/apis/friend.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateFriendRaidTodoRequest } from "@core/types/friend";

export default (
  options?: CommonUseMutationOptions<UpdateFriendRaidTodoRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => friendApi.updateRaidTodo(params),
  });

  return mutation;
};
