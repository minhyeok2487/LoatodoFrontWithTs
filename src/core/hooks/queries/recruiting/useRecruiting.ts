import { useQuery } from "@tanstack/react-query";

import * as recruitingApi from "@core/apis/recruiting.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { RecruitingDetail } from "@core/types/recruiting";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
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
