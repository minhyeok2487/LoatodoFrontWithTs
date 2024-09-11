import { useMutation } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { AddCustomTodoRequest } from "@core/types/todo";

export default (options?: CommonUseMutationOptions<AddCustomTodoRequest>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.addCustomTodo(params),
  });

  return mutation;
};
