import { useMutation } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { TodoRaid } from "@core/types/character";
import type { UpdateRaidTodoMemoRequest } from "@core/types/todo";

export default (
  options?: CommonUseMutationOptions<UpdateRaidTodoMemoRequest, TodoRaid>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateRaidTodoMemo(params),
  });

  return mutation;
};
