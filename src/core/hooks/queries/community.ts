import { useInfiniteQuery } from "@tanstack/react-query";
import type {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

import * as communityApi from "@core/apis/community.api";
import { CommunityList } from "@core/types/community";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export const useInfiniteCommunityList = (
  limit: number,
  options?: Omit<
    UseInfiniteQueryOptions<
      CommunityList,
      AxiosError,
      InfiniteData<CommunityList, number | undefined>,
      CommunityList,
      QueryKey,
      number | undefined
    >,
    "initialPageParam" | "queryKey" | "queryFn" | "getNextPageParam"
  >
) => {
  const query = useInfiniteQuery({
    initialPageParam: undefined,
    queryKey: queryKeyGenerator.getCommunityList(),
    queryFn: ({ pageParam }) =>
      communityApi.getCommunityList({
        communityId: pageParam,
        limit,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext
        ? lastPage.content[lastPage.content.length - 1].communityId
        : null,
    ...options,
  });

  return query;
};
