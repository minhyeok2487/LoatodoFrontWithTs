import { useQuery } from "@tanstack/react-query";

import * as friendApi from "@core/apis/friend.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { WeeklyRaid } from "@core/types/character";
import type { GetAvaiableFriendWeeklyRaidsRequest } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  params: GetAvaiableFriendWeeklyRaidsRequest,
  options?: CommonUseQueryOptions<WeeklyRaid[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getAvailableFriendWeeklyRaids(params),
    queryFn: () => friendApi.getAvailableWeeklyRaids(params),
  });

  return query;
};
