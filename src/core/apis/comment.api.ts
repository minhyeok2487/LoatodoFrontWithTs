import type { NoDataResponse } from "@core/types/api";
import type {
  AddCommentRequest,
  EditCommentRequest,
  GetCommentsRequest,
  GetCommentsResponse,
  GetCommentsRequestV2,
  GetCommentsResponseV2,
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

export const getCommentsV2 = ({
  commentsId,
}: GetCommentsRequestV2): Promise<GetCommentsResponseV2> => {
  return mainAxios
    .get(`/api/v1/comments`, {
      params: {
        commentsId: commentsId ?? null
      },
    })
    .then((res) => res.data);
};

export const addComment = ({
  parentId,
  body,
}: AddCommentRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/v3/comments", {
    parentId,
    body,
  });
};

export const editComment = ({
  id,
  body,
}: EditCommentRequest): Promise<NoDataResponse> => {
  return mainAxios.patch(`/v4/comments`, {
    id,
    body,
  });
};

export const removeComment = (commentId: number): Promise<NoDataResponse> => {
  return mainAxios.delete(`/v3/comments/${commentId}`);
};
