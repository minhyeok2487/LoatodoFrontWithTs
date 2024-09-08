import { useQuery } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { CustomTodoItem } from "@core/types/todo";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  friendUsername?: string,
  options?: CommonUseQueryOptions<CustomTodoItem[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getCustomTodos(friendUsername),
    queryFn: () => todoApi.getCustomTodos(friendUsername),
  });

  return query;
};
