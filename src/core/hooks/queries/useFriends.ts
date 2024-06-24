import { useQuery } from "@tanstack/react-query";
import type { UndefinedInitialDataOptions } from "@tanstack/react-query";

import * as friendsApi from "@core/apis/friend.api";
import { STALE_TIME_MS } from "@core/constants";
import queryKeys from "@core/constants/queryKeys";
import type { FriendType } from "@core/types/friend";

type Options = Omit<
  UndefinedInitialDataOptions<FriendType[]>,
  "queryKey" | "queryFn"
>;

const useFriends = (options?: Options) => {
  const queryKey = [queryKeys.GET_FRIENDS];
  const getFriends = useQuery<FriendType[]>({
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
