import { useMutation } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateCustomTodoRequest } from "@core/types/todo";

export default (
  options?: CommonUseMutationOptions<UpdateCustomTodoRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateCustomTodo(params),
  });

  return mutation;
};
