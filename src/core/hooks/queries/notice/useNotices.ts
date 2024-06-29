import { useQuery } from "@tanstack/react-query";

import * as noticeApi from "@core/apis/notice.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type {
  GetNoticeListRequest,
  GetNoticesResponse,
} from "@core/types/notice";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

const useNotices = (
  params: GetNoticeListRequest,
  options?: CommonUseQueryOptions<GetNoticesResponse>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getNotices(params),
    queryFn: () => noticeApi.getNotices(params),
  });

  return query;
};

export default useNotices;
