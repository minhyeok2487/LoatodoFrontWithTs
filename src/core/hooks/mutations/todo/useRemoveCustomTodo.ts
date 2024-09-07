import { useMutation } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { RemoveCustomTodoRequest } from "@core/types/todo";

export default (
  options?: CommonUseMutationOptions<RemoveCustomTodoRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.removeCustomtodo(params),
  });

  return mutation;
};
