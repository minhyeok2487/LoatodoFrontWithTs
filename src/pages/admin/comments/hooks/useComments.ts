import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as adminApi from "@core/apis/admin.api";
import type { AdminCommentListParams } from "@core/types/admin";

export const useComments = (params: AdminCommentListParams = {}) => {
  return useQuery({
    queryKey: ["admin", "comments", params],
    queryFn: () => adminApi.getComments(params),
    staleTime: 1000 * 60 * 2,
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => adminApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "comments"] });
    },
  });
};
