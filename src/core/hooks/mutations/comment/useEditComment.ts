import { useMutation } from "@tanstack/react-query";

import * as commentApi from "@core/apis/comment.api";
import type { NoDataResponse } from "@core/types/api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { EditCommentRequest } from "@core/types/comment";

export default (
  options?: CommonUseMutationOptions<EditCommentRequest, NoDataResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => commentApi.editComment(params),
  });

  return mutation;
};
