import type { NoDataResponse } from "@core/types/api";
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
}: AddCommentRequest): Promise<NoDataResponse> => {
  return mainAxios
    .post("/v3/comments", {
      parentId,
      body,
    })
    .then((res) => res);
};

export const editComment = ({
  id,
  body,
}: EditCommentRequest): Promise<NoDataResponse> => {
  return mainAxios
    .patch(`/v4/comments`, {
      id,
      body,
    })
    .then((res) => res);
};

export const removeComment = (commentId: number): Promise<NoDataResponse> => {
  return mainAxios.delete(`/v3/comments/${commentId}`).then((res) => res);
};
