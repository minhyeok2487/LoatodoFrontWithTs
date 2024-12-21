import { useQuery } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import { STALE_TIME_MS } from "@core/constants";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { Character } from "@core/types/character";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (options?: CommonUseQueryOptions<Character[]>, friendUsername?: string) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getDeletedCharacters(friendUsername),
    queryFn: () => characterApi.getDeletedCharacters(friendUsername),
    staleTime: STALE_TIME_MS, // 임시
  });

  return query;
};
