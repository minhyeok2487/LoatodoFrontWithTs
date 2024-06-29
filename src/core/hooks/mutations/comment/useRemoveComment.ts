import { useMutation } from "@tanstack/react-query";

import * as commentApi from "@core/apis/comment.api";
import type { OkResponse } from "@core/types/api";
import type { UseMutationWithParams } from "@core/types/app";

const useRemoveComment = (
  options?: UseMutationWithParams<number, OkResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (commentId) => commentApi.removeComment(commentId),
  });

  return mutation;
};

export default useRemoveComment;
