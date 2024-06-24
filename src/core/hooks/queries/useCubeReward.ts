import { useQuery } from "@tanstack/react-query";
import type { UndefinedInitialDataOptions } from "@tanstack/react-query";

import * as characterApi from "@core/apis/Character.api";
import type { CubeReward } from "@core/types/Character.type";

type Options = Omit<
  UndefinedInitialDataOptions<CubeReward>,
  "queryKey" | "queryFn"
>;

const useCubeReward = (name: CubeReward["name"], options: Options) => {
  const queryKey = ["GET_CUBE_REWARD", name];
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
