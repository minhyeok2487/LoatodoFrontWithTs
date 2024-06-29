import { useMutation } from "@tanstack/react-query";

import * as commentApi from "@core/apis/comment.api";
import type { NoDataResponse } from "@core/types/api";
import type { CommonUseMutationOptions } from "@core/types/app";

export default (options?: CommonUseMutationOptions<number, NoDataResponse>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (commentId) => commentApi.removeComment(commentId),
  });

  return mutation;
};
