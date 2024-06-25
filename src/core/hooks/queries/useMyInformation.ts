import { useQuery } from "@tanstack/react-query";
import type { UndefinedInitialDataOptions } from "@tanstack/react-query";

import * as memberApi from "@core/apis/member.api";
import { STALE_TIME_MS } from "@core/constants";
import queryKeys from "@core/constants/queryKeys";
import type { MemberType } from "@core/types/member";

type Options = Omit<
  UndefinedInitialDataOptions<MemberType>,
  "queryKey" | "queryFn"
>;

const useMyInformation = (options?: Options) => {
  const queryKey = [queryKeys.GET_MY_INFORMATION];
  const getMyInformation = useQuery<MemberType>({
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
