import { useQuery } from "@tanstack/react-query";

import * as armoryApi from "@core/apis/armory.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { ArmoryResponse } from "@core/types/armory";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  characterName: string,
  options?: CommonUseQueryOptions<ArmoryResponse>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getArmory(characterName),
    queryFn: () => armoryApi.getArmory(characterName),
    enabled: !!characterName,
    staleTime: 5 * 60 * 1000,
  });

  return query;
};
