import { useQuery } from "@tanstack/react-query";

import * as generalTodoApi from "@core/apis/generalTodo.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { GeneralTodoOverviewResponse } from "@core/types/generalTodo";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export const useGeneralTodoOverview = (
  options?: CommonUseQueryOptions<GeneralTodoOverviewResponse>
) => {
  return useQuery({
    ...options,
    queryKey: queryKeyGenerator.getGeneralTodoOverview(),
    queryFn: () => generalTodoApi.getGeneralTodoOverview(),
  });
};
