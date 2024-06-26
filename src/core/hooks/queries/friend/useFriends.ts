import { useQuery } from "@tanstack/react-query";

import * as friendsApi from "@core/apis/friend.api";
import { STALE_TIME_MS } from "@core/constants";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (options?: CommonUseQueryOptions<Friend[]>) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getFriends(),
    queryFn: () => friendsApi.getFriends(),
    staleTime: STALE_TIME_MS, // 임시
  });

  return query;
};
