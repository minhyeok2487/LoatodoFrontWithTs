import { useQuery } from "@tanstack/react-query";

import * as memberApi from "@core/apis/member.api";
import { STALE_TIME_MS } from "@core/constants";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { MemberType } from "@core/types/member";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

const useMyInformation = (options?: CommonUseQueryOptions<MemberType>) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getMyInformation(),
    queryFn: () => memberApi.getMyInformation(),
    staleTime: STALE_TIME_MS, // 임시
  });

  return query;
};

export default useMyInformation;
