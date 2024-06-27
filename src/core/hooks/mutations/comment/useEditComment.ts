import { useMutation } from "@tanstack/react-query";

import * as commentApi from "@core/apis/comment.api";
import type { OkResponse } from "@core/types/api";
import type { UseMutationWithParams } from "@core/types/app";
import type { EditCommentRequest } from "@core/types/comment";

const useEditComment = (
  options?: UseMutationWithParams<EditCommentRequest, OkResponse>
) => {
  const editComment = useMutation({
    ...options,
    mutationFn: (params) => commentApi.editComment(params),
  });

  return editComment;
};

export default useEditComment;
