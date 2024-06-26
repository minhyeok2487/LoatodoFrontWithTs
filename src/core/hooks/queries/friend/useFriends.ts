import { useQuery } from "@tanstack/react-query";

import * as friendsApi from "@core/apis/friend.api";
import { STALE_TIME_MS } from "@core/constants";
import queryKeys from "@core/constants/queryKeys";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { FriendType } from "@core/types/friend";

const useFriends = (options?: CommonUseQueryOptions<FriendType[]>) => {
  const queryKey = [queryKeys.GET_FRIENDS];
  const getFriends = useQuery({
    ...options,
    queryKey,
    queryFn: () => friendsApi.getFriends(),
    staleTime: STALE_TIME_MS, // 임시
  });

  return {
    getFriends,
    getFriendsQueryKey: queryKey,
  };
};

export default useFriends;
