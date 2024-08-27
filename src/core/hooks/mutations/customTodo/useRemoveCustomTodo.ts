import { useMutation } from "@tanstack/react-query";

import * as customTodoApi from "@core/apis/customTodo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { RemoveCustomTodoRequest } from "@core/types/customTodo";

export default (
  options?: CommonUseMutationOptions<RemoveCustomTodoRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => customTodoApi.removeCustomtodo(params),
  });

  return mutation;
};
