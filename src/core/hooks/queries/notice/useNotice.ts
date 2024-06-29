import { useQuery } from "@tanstack/react-query";

import * as noticeApi from "@core/apis/notice.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { NoticeItem } from "@core/types/notice";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

const useNotice = (
  noticeId: number,
  options?: CommonUseQueryOptions<NoticeItem>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getNotice(noticeId),
    queryFn: () => noticeApi.getNotice(noticeId),
  });

  return query;
};

export default useNotice;
