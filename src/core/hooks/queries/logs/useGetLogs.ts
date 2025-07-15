import { useInfiniteQuery } from "@tanstack/react-query";
import type {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

import * as logsApi from "@core/apis/logs.api";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";
import type { Logs } from "@core/types/logs";
import type { LOG_CONTENT } from "@core/constants";

export default (
  characterId?: number,
  logContent?: keyof typeof LOG_CONTENT,
  options?: Omit<
    UseInfiniteQueryOptions<
      Logs,
      AxiosError,
      InfiniteData<Logs, number | undefined>,
      Logs,
      QueryKey,
      number | undefined
    >,
    "initialPageParam" | "queryKey" | "queryFn" | "getNextPageParam"
  >
) => {
  const query = useInfiniteQuery({
    initialPageParam: undefined,
    queryKey: [...queryKeyGenerator.getLogs(), { logContent, characterId }],
    queryFn: ({ pageParam }) =>
      logsApi.getLogs({
        logsId: pageParam,
        characterId,
        logContent,
      }),
    getNextPageParam: (lastPage) =>
      !lastPage.last
        ? lastPage.content[lastPage.content.length - 1].logsId
        : null,
    ...options,
  });

  return query;
};