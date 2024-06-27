import { useQuery } from "@tanstack/react-query";

import * as noticeApi from "@core/apis/notice.api";
import queryKeys from "@core/constants/queryKeys";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { NoticeItem } from "@core/types/notice";

const useNotice = (
  noticeId: number,
  options?: CommonUseQueryOptions<NoticeItem>
) => {
  const queryKey = [queryKeys.GET_NOTICE, noticeId];
  const getNotice = useQuery({
    ...options,
    queryKey,
    queryFn: () => noticeApi.getNotice(noticeId),
  });

  return {
    getNotice,
    getNoticeQueryKey: queryKey,
  };
};

export default useNotice;
