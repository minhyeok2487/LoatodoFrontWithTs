import { useQuery } from "@tanstack/react-query";

import * as customTodoApi from "@core/apis/customTodo.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { CustomTodoItem } from "@core/types/customTodo";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  friendUsername?: string,
  options?: CommonUseQueryOptions<CustomTodoItem[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getCustomTodos(friendUsername),
    queryFn: () => customTodoApi.getCustomTodos(friendUsername),
  });

  return query;
};
