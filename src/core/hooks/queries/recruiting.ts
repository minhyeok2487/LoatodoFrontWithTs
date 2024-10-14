import { useQuery } from "@tanstack/react-query";

import * as recruitingApi from "@core/apis/recruiting.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type {
  GetRecruitingsIndexResponse,
  GetRecruitingsRequest,
  GetRecruitingsResponse,
  RecruitingDetail,
} from "@core/types/recruiting";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export const useRecruitingIndex = (
  options?: CommonUseQueryOptions<GetRecruitingsIndexResponse>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getRecruitingsIndex(),
    queryFn: () => recruitingApi.getRecruitingsIndex(),
  });

  return query;
};

export const useRecruitings = (
  params: GetRecruitingsRequest,
  options?: CommonUseQueryOptions<GetRecruitingsResponse>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getRecruitings(params),
    queryFn: () => recruitingApi.getRecruitings(params),
  });

  return query;
};

export const useRecruiting = (
  recruitingBoardId: number,
  options?: CommonUseQueryOptions<RecruitingDetail>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getRecruiting(recruitingBoardId),
    queryFn: () => recruitingApi.getRecruiting(recruitingBoardId),
  });

  return query;
};
