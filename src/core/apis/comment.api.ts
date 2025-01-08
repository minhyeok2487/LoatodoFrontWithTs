import type {
  GetCommentsRequest,
  GetCommentsResponse,
} from "@core/types/comment";

import mainAxios from "./mainAxios";

export const getComments = ({
  page,
}: GetCommentsRequest): Promise<GetCommentsResponse> => {
  return mainAxios
    .get(`/api/v1/comments`, {
      params: {
        page,
      },
    })
    .then((res) => res.data);
};