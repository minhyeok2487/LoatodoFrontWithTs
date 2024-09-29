import { useQuery } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { CubeName } from "@core/types/character";
import type { CubeReward } from "@core/types/cube";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  name: CubeName,
  options?: CommonUseQueryOptions<CubeReward>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getCubeReward(name),
    queryFn: () => characterApi.getCubeReward(name),
  });

  return query;
};
