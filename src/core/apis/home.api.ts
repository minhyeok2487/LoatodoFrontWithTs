import { NoticesDto } from "@core/types/notice";

import mainAxios from "./mainAxios";

export const getNotices = (page: number, size: number): Promise<NoticesDto> => {
  return mainAxios
    .get("/v3/notices", {
      params: {
        page,
        size,
      },
    })
    .then((res) => res.data);
};
