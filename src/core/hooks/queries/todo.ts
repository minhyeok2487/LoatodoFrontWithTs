import { useQuery } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { WeeklyRaid } from "@core/types/character";
import type {
  CustomTodoItem,
  GetAvaiableRaidsRequest,
  ServerTodoOverviewResponse,
} from "@core/types/todo";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export const useCustomTodos = (
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

export const useAvailableRaids = (
  params: GetAvaiableRaidsRequest,
  options?: CommonUseQueryOptions<WeeklyRaid[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getAvailableRaids(params),
    queryFn: () => todoApi.getAvailableRaids(params),
  });

  return query;
};

export const useServerTodos = (
  friendUsername?: string,
  options?: CommonUseQueryOptions<ServerTodoOverviewResponse>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getServerTodos(friendUsername),
    queryFn: () => todoApi.getServerTodos(friendUsername),
  });

  return query;
};
