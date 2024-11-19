import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

import * as communityApi from "@core/apis/community.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { CommunityDetail, CommunityList } from "@core/types/community";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";
import type { COMMUNITY_CATEGORY } from '../../constants/index';

export const useInfiniteCommunityList = (
  limit: number,
  category?: keyof typeof COMMUNITY_CATEGORY,
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
    queryKey: [...queryKeyGenerator.getCommunityList(), { category, limit }],
    queryFn: ({ pageParam }) =>
      communityApi.getCommunityList({
        communityId: pageParam,
        limit,
        category,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext
        ? lastPage.content[lastPage.content.length - 1].communityId
        : null,
    ...options,
  });

  return query;
};

export const useCommunityPost = (
  communityId: number,
  options?: CommonUseQueryOptions<CommunityDetail>
) => {
  const query = useQuery({
    queryKey: queryKeyGenerator.getCommunityPost(communityId),
    queryFn: () => communityApi.getCommunityPost(communityId),
    ...options,
  });

  return query;
};
