import { useQuery } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import { STALE_TIME_MS } from "@core/constants";
import queryKeys from "@core/constants/queryKeys";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { CharacterType } from "@core/types/character";

const useCharacters = (options?: CommonUseQueryOptions<CharacterType[]>) => {
  const queryKey = [queryKeys.GET_CHARACTERS];
  const getCharacters = useQuery({
    ...options,
    queryKey,
    queryFn: () => characterApi.getCharacters(),
    staleTime: STALE_TIME_MS, // 임시
  });

  return {
    getCharacters,
    getCharactersQueryKey: queryKey,
  };
};

export default useCharacters;
