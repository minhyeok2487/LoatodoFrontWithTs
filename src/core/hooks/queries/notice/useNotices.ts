import { useQuery } from "@tanstack/react-query";

import * as noticeApi from "@core/apis/notice.api";
import queryKeys from "@core/constants/queryKeys";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { GetListRequest, GetNoticesResponse } from "@core/types/notice";

const useNotices = (
  params: GetListRequest,
  options?: CommonUseQueryOptions<GetNoticesResponse>
) => {
  const queryKey = [queryKeys.GET_NOTICES, params];
  const getNotices = useQuery({
    ...options,
    queryKey,
    queryFn: () => noticeApi.getNotices(params),
  });

  return {
    getNotices,
    getNoticesQueryKey: queryKey,
  };
};

export default useNotices;
