import { useQuery } from "@tanstack/react-query";

import * as customTodoApi from "@core/apis/customTodo.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { CustomTodoItem } from "@core/types/customTodo";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (options?: CommonUseQueryOptions<CustomTodoItem[]>) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getCustomTodos(),
    queryFn: () => customTodoApi.getCustomTodos(),
  });

  return query;
};
