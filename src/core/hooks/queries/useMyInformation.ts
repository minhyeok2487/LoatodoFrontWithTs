import { useQuery } from "@tanstack/react-query";

import * as memberApi from "@core/apis/member.api";
import { STALE_TIME_MS } from "@core/constants";
import queryKeys from "@core/constants/queryKeys";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { MemberType } from "@core/types/member";

const useMyInformation = (options?: CommonUseQueryOptions<MemberType>) => {
  const queryKey = [queryKeys.GET_MY_INFORMATION];
  const getMyInformation = useQuery({
    ...options,
    queryKey,
    queryFn: () => memberApi.getMyInformation(),
    staleTime: STALE_TIME_MS, // 임시
  });

  return {
    getMyInformation,
    getMyInformationQueryKey: queryKey,
  };
};

export default useMyInformation;
