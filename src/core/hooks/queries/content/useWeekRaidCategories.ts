import { useQuery } from "@tanstack/react-query";

import * as contentApi from "@core/apis/content.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { WeekRaidCategoryItem } from "@core/types/content";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (options?: CommonUseQueryOptions<WeekRaidCategoryItem[]>) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getWeekRaidCategories(),
    queryFn: () => contentApi.getWeekRaidCategories(),
  });

  return query;
};
