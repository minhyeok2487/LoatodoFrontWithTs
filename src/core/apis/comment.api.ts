import type { OkResponse } from "@core/types/api";
import type {
  AddCommentRequest,
  EditCommentRequest,
  GetCommentsRequest,
  GetCommentsResponse,
} from "@core/types/comment";

import mainAxios from "./mainAxios";

export const getComments = ({
  page,
}: GetCommentsRequest): Promise<GetCommentsResponse> => {
  return mainAxios
    .get(`/v3/comments`, {
      params: {
        page,
      },
    })
    .then((res) => res.data);
};

export const addComment = ({
  parentId,
  body,
}: AddCommentRequest): Promise<OkResponse> => {
  return mainAxios
    .post("/v3/comments", {
      parentId,
      body,
    })
    .then((res) => res.data);
};

export const editComment = ({
  page, // LOAT-98 추후 삭제 예정
  id,
  body,
}: EditCommentRequest): Promise<OkResponse> => {
  return mainAxios
    .patch(`/v3/comments?page=${page}`, {
      id,
      body,
    })
    .then((res) => res.data);
};

export const removeComment = (commentId: number): Promise<OkResponse> => {
  return mainAxios.delete(`/v3/comments/${commentId}`).then((res) => res.data);
};
