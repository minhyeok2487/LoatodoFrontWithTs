import { useMutation } from "@tanstack/react-query";

import * as commentApi from "@core/apis/comment.api";
import type { OkResponse } from "@core/types/api";
import type { UseMutationWithParams } from "@core/types/app";
import type { AddCommentRequest } from "@core/types/comment";

const useAddComment = (
  options?: UseMutationWithParams<AddCommentRequest, OkResponse>
) => {
  const addComment = useMutation({
    ...options,
    mutationFn: (params) => commentApi.addComment(params),
  });

  return addComment;
};

export default useAddComment;