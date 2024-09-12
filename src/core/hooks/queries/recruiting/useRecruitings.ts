import { useQuery } from "@tanstack/react-query";

import * as recruitingApi from "@core/apis/recruiting.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type {
  GetRecruitingsRequest,
  GetRecruitingsResponse,
} from "@core/types/recruiting";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
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
