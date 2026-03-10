import { useQuery } from "@tanstack/react-query";

import * as contentApi from "@core/apis/content.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { WeekContentCategoryMeta } from "@core/types/content";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (options?: CommonUseQueryOptions<WeekContentCategoryMeta[]>) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getWeekContentCategories(),
    queryFn: () => contentApi.getWeekContentCategories(),
    staleTime: Infinity,
  });

  return query;
};
