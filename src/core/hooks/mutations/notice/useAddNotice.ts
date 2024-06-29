import { useMutation } from "@tanstack/react-query";

import * as noticeApi from "@core/apis/notice.api";
import type { UseMutationWithParams } from "@core/types/app";
import type { AddNoticeRequest, NoticeItem } from "@core/types/notice";

export default (
  options?: UseMutationWithParams<AddNoticeRequest, NoticeItem>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => noticeApi.addNotice(params),
  });

  return mutation;
};
