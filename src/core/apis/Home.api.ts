import { NoticesDto } from "@core/types/NoticeResponse";

import api from "./api";

export const getNotices = (page: number, size: number): Promise<NoticesDto> => {
  return api
    .get("/v3/notices", {
      params: {
        page,
        size,
      },
    })
    .then((res) => res.data);
};
