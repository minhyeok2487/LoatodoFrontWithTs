import { useQuery } from "@tanstack/react-query";

import * as friendApi from "@core/apis/friend.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { SearchCharacterItem } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  characterName: string,
  options?: CommonUseQueryOptions<SearchCharacterItem[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.searchCharacter(characterName),
    queryFn: () => friendApi.searchCharacter(characterName),
  });

  return query;
};
