import { useMutation } from "@tanstack/react-query";

import * as commentApi from "@core/apis/comment.api";
import type { OkResponse } from "@core/types/api";
import type { UseMutationWithParams } from "@core/types/app";
import type { EditCommentRequest } from "@core/types/comment";

export default (
  options?: UseMutationWithParams<EditCommentRequest, OkResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => commentApi.editComment(params),
  });

  return mutation;
};
