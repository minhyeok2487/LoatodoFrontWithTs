import { CommentsType } from "@core/types/Comment.type.";

import api from "./api";

export const getComments = (page: number): Promise<CommentsType> => {
  return api
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
): Promise<CommentsType[]> => {
  const updateContent = {
    parentId,
    body: text,
  };

  return api.post("/v3/comments", updateContent).then((res) => res.data);
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

  return api
    .patch(`/v3/comments?page=${page}`, updateContent)
    .then((res) => res.data);
};

export const deleteComment = (commentId: number): Promise<any> => {
  return api.delete(`/v3/comments/${commentId}`).then((res) => res.data);
};
