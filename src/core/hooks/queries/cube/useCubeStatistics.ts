import { useQuery } from "@tanstack/react-query";

import * as cubeApi from "@core/apis/cube.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { CubeReward } from "@core/types/cube";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (options?: CommonUseQueryOptions<CubeReward[]>) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getCubeStatistics(),
    queryFn: () => cubeApi.getCubeStatistics(),
  });

  return query;
};
