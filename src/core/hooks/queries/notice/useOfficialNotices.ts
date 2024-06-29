import { useQuery } from "@tanstack/react-query";

import * as noticeApi from "@core/apis/notice.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type {
  GetNoticeListRequest,
  GetOfficialNoticesResponse,
} from "@core/types/notice";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  params: GetNoticeListRequest,
  options?: CommonUseQueryOptions<GetOfficialNoticesResponse>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getOfficialNotices(params),
    queryFn: () => noticeApi.getOfficialNotices(params),
  });

  return query;
};
