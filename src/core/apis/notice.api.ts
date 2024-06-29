import type {
  AddNoticeRequest,
  GetNoticeListRequest,
  GetNoticesResponse,
  GetOfficialNoticesResponse,
  NoticeItem,
} from "@core/types/notice";

import mainAxios from "./mainAxios";

export const getNotices = ({
  page,
  size,
}: GetNoticeListRequest): Promise<GetNoticesResponse> => {
  return mainAxios
    .get("/v3/boards", { params: { page, size } })
    .then((res) => res.data);
};

export const getNotice = (noticeId: number): Promise<NoticeItem> => {
  return mainAxios.get(`/v3/boards/${noticeId}`).then((res) => res.data);
};

export const addNotice = ({
  content,
  fileNames,
  title,
}: AddNoticeRequest): Promise<NoticeItem> => {
  return mainAxios
    .post("/v3/boards/", {
      content,
      fileNames,
      title,
    })
    .then((res) => res.data);
};

export const getOfficialNotices = ({
  page,
  size,
}: GetNoticeListRequest): Promise<GetOfficialNoticesResponse> => {
  return mainAxios
    .get("/v3/notices", {
      params: {
        page,
        size,
      },
    })
    .then((res) => res.data);
};
