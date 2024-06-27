import {
  CommentItem,
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

export const addComment = (
  text: string,
  parentId?: number
): Promise<CommentItem> => {
  const updateContent = {
    parentId,
    body: text,
  };

  return mainAxios.post("/v3/comments", updateContent).then((res) => res.data);
};

export const updateComment = (
  text: string,
  commentId: number,
  page: number
): Promise<any> => {
  const updateContent = {
    id: commentId,
    body: text,
  };

  return mainAxios
    .patch(`/v3/comments?page=${page}`, updateContent)
    .then((res) => res.data);
};

export const deleteComment = (commentId: number): Promise<any> => {
  return mainAxios.delete(`/v3/comments/${commentId}`).then((res) => res.data);
};
