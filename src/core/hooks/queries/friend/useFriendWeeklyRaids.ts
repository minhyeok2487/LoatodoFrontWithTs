import { useQuery } from "@tanstack/react-query";

import * as friendApi from "@core/apis/friend.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { WeeklyRaid } from "@core/types/character";
import type { GetFriendWeeklyRaidsRequest } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  params: GetFriendWeeklyRaidsRequest,
  options?: CommonUseQueryOptions<WeeklyRaid[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getFriendWeeklyRaid(params),
    queryFn: () => friendApi.getFriendWeeklyRaids(params),
  });

  return query;
};
