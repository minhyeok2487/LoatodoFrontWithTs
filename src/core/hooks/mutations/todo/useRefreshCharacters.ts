import { useMutation } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseMutationOptions } from "@core/types/app";

export default (options?: CommonUseMutationOptions<string | undefined>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (friendUsername) => todoApi.refreshCharacters(friendUsername),
  });

  return mutation;
};
