import { useQuery } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { GetWeeklyRaidsRequest, WeeklyRaid } from "@core/types/character";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  params: GetWeeklyRaidsRequest,
  options?: CommonUseQueryOptions<WeeklyRaid[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getWeeklyRaids(params),
    queryFn: () => characterApi.getWeeklyRaids(params),
  });

  return query;
};
