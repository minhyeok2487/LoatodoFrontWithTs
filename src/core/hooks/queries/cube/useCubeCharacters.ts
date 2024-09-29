import { useQuery } from "@tanstack/react-query";

import * as cubeApi from "@core/apis/cube.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { CubeCharacter } from "@core/types/cube";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (options?: CommonUseQueryOptions<CubeCharacter[]>) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getCubeCharacters(),
    queryFn: () => cubeApi.getCubeCharacters(),
  });

  return query;
};
