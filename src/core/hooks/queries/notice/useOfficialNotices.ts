import { useQuery } from "@tanstack/react-query";

import * as noticeApi from "@core/apis/notice.api";
import queryKeys from "@core/constants/queryKeys";
import type { CommonUseQueryOptions } from "@core/types/app";
import type {
  GetListRequest,
  GetOfficialNoticesResponse,
} from "@core/types/notice";

const useOfficialNotices = (
  params: GetListRequest,
  options?: CommonUseQueryOptions<GetOfficialNoticesResponse>
) => {
  const queryKey = [queryKeys.GET_OFFICIAL_NOTICES, params];
  const getOfficialNotices = useQuery({
    ...options,
    queryKey,
    queryFn: () => noticeApi.getOfficialNotices(params),
  });

  return {
    getOfficialNotices,
    getOfficialNoticesQueryKey: queryKey,
  };
};

export default useOfficialNotices;
