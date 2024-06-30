import { useQuery } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type {
  GetAvailableWeeklyRaidsRequest,
  WeeklyRaid,
} from "@core/types/character";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  params: GetAvailableWeeklyRaidsRequest,
  options?: CommonUseQueryOptions<WeeklyRaid[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getAvailableWeeklyRaids(params),
    queryFn: () => characterApi.getAvailableWeeklyRaids(params),
  });

  return query;
};
