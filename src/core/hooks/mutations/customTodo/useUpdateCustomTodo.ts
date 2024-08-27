import { useMutation } from "@tanstack/react-query";

import * as customTodoApi from "@core/apis/customTodo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateCustomTodoRequest } from "@core/types/customTodo";

export default (
  options?: CommonUseMutationOptions<UpdateCustomTodoRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => customTodoApi.updateCustomTodo(params),
  });

  return mutation;
};
