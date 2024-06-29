import { useQuery } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import { STALE_TIME_MS } from "@core/constants";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { CharacterType } from "@core/types/character";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (options?: CommonUseQueryOptions<CharacterType[]>) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getCharacters(),
    queryFn: () => characterApi.getCharacters(),
    staleTime: STALE_TIME_MS, // 임시
  });

  return query;
};
