import { useMutation } from "@tanstack/react-query";

import * as customTodoApi from "@core/apis/customTodo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { CheckCustomTodoRequest } from "@core/types/customTodo";

export default (options?: CommonUseMutationOptions<CheckCustomTodoRequest>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => customTodoApi.checkCustomTodo(params),
  });

  return mutation;
};
