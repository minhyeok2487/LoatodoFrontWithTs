import { useMutation } from "@tanstack/react-query";

import * as noticeApi from "@core/apis/notice.api";
import type { UseMutationWithParams } from "@core/types/app";
import type { AddNoticeRequest, NoticeItem } from "@core/types/notice";

const useAddNotice = (
  options?: UseMutationWithParams<AddNoticeRequest, NoticeItem>
) => {
  const addComment = useMutation({
    ...options,
    mutationFn: (params) => noticeApi.addNotice(params),
  });

  return addComment;
};

export default useAddNotice;
