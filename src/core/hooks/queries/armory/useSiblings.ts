import { useQuery } from "@tanstack/react-query";

import * as armoryApi from "@core/apis/armory.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { SiblingCharacter } from "@core/types/armory";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  characterName: string,
  options?: CommonUseQueryOptions<SiblingCharacter[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getSiblings(characterName),
    queryFn: () => armoryApi.getSiblings(characterName),
    enabled: false,
    staleTime: 5 * 60 * 1000,
  });

  return query;
};
