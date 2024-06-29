import { useQuery } from "@tanstack/react-query";

import * as commentApi from "@core/apis/comment.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type {
  GetCommentsRequest,
  GetCommentsResponse,
} from "@core/types/comment";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

const useComments = (
  params: GetCommentsRequest,
  options?: CommonUseQueryOptions<GetCommentsResponse>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getComments(params),
    queryFn: () => commentApi.getComments(params),
  });

  return query;
};

export default useComments;
