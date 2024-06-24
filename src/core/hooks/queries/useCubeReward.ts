import { useQuery } from "@tanstack/react-query";
import type { UndefinedInitialDataOptions } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import queryKeys from "@core/constants/queryKeys";
import type { CubeReward } from "@core/types/character";

type Options = Omit<
  UndefinedInitialDataOptions<CubeReward>,
  "queryKey" | "queryFn"
>;

const useCubeReward = (name: CubeReward["name"], options?: Options) => {
  const queryKey = [queryKeys.GET_CUBE_REWARD, name];
  const getCubeReward = useQuery<CubeReward>({
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
