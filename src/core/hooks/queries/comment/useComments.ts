import { useQuery } from "@tanstack/react-query";

import * as commentApi from "@core/apis/comment.api";
import queryKeys from "@core/constants/queryKeys";
import type { CommonUseQueryOptions } from "@core/types/app";
import type {
  GetCommentsRequest,
  GetCommentsResponse,
} from "@core/types/comment";

const useComments = (
  params: GetCommentsRequest,
  options?: CommonUseQueryOptions<GetCommentsResponse>
) => {
  const queryKey = [queryKeys.GET_COMMENTS, params.page];
  const getComments = useQuery({
    ...options,
    queryKey,
    queryFn: () => commentApi.getComments(params),
  });

  return {
    getComments,
    getCommentsQueryKey: queryKey,
  };
};

export default useComments;
