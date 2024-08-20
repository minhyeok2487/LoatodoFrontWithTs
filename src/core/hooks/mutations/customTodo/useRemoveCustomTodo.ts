import { useMutation } from "@tanstack/react-query";

import * as customTodoApi from "@core/apis/customTodo.api";
import type { CommonUseMutationOptions } from "@core/types/app";

export default (options?: CommonUseMutationOptions<number>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => customTodoApi.removeCustomtodo(params),
  });

  return mutation;
};
