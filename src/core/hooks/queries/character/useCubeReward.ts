import { useQuery } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { CubeName, CubeReward } from "@core/types/character";
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
