import { useMutation } from "@tanstack/react-query";

import * as customTodoApi from "@core/apis/customTodo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { AddCustomTodoRequest } from "@core/types/customTodo";

export default (options?: CommonUseMutationOptions<AddCustomTodoRequest>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => customTodoApi.addCustomTodo(params),
  });

  return mutation;
};
