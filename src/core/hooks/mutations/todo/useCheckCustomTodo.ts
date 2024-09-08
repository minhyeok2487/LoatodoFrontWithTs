import { useMutation } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { CheckCustomTodoRequest } from "@core/types/todo";

export default (options?: CommonUseMutationOptions<CheckCustomTodoRequest>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.checkCustomTodo(params),
  });

  return mutation;
};
