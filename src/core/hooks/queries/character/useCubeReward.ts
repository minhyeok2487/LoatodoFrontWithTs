import { useQuery } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import queryKeys from "@core/constants/queryKeys";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { CubeReward } from "@core/types/character";

const useCubeReward = (
  name: CubeReward["name"],
  options?: CommonUseQueryOptions<CubeReward>
) => {
  const queryKey = [queryKeys.GET_CUBE_REWARD, name];
  const getCubeReward = useQuery({
    ...options,
    queryKey,
    queryFn: () => characterApi.getCubeReward(name),
  });

  return {
    getCubeReward,
    getCubeRewardQueryKey: queryKey,
  };
};

export default useCubeReward;
