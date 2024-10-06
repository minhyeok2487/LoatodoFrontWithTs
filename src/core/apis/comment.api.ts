import type { NoDataResponse } from "@core/types/api";
import type {
  AddCommentRequest,
  EditCommentRequest,
  GetCommentsRequest,
  GetCommentsResponse,
} from "@core/types/comment";

import mainAxios from "./mainAxios2";

export const getComments = ({
  page,
}: GetCommentsRequest): Promise<GetCommentsResponse> => {
  return mainAxios
    .get(`/comments`, {
      params: {
        page,
      },
    })
    .then((res) => res.data);
};

export const addComment = ({
  parentId,
  body,
}: AddCommentRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/comments", {
    parentId,
    body,
  });
};

export const editComment = ({
  id,
  body,
}: EditCommentRequest): Promise<NoDataResponse> => {
  return mainAxios.patch(`/comments`, {
    id,
    body,
  });
};

export const removeComment = (commentId: number): Promise<NoDataResponse> => {
  return mainAxios.delete(`/comments/${commentId}`);
};
