import { CommentsType } from "../types/Comment.type.";
import api from "./api";

export async function getComments(page: number): Promise<CommentsType> {
  return await api.get(`/v3/comments?page=${page}`).then((res) => res.data);
}

export async function addComment(
  text: string,
  parentId?: number
): Promise<CommentsType[]> {
  const updateContent = {
    body: text,
    parentId: parentId,
  };
  return await api.post("/v3/comments", updateContent).then((res) => res.data);
}

export async function updateComment(
  text: string,
  commentId: number,
  page: number
): Promise<any> {
  const updateContent = {
    body: text,
    id: commentId,
  };
  return await api
    .patch(`/v3/comments?page=${page}`, updateContent)
    .then((res) => res.data);
}

export async function deleteComment(commentId: number): Promise<any> {
  return await api
    .delete(`/v3/comments/${commentId}`)
    .then((res) => res.data);
}
