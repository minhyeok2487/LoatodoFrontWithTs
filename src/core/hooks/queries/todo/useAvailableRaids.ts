import { useQuery } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { WeeklyRaid } from "@core/types/character";
import type { GetAvaiableRaidsRequest } from "@core/types/todo";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  params: GetAvaiableRaidsRequest,
  options?: CommonUseQueryOptions<WeeklyRaid[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getAvailableRaids(params),
    queryFn: () => todoApi.getAvailableRaids(params),
  });

  return query;
};
