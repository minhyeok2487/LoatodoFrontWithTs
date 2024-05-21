import { CommentsType } from "../types/Comment.type.";
import api from "./api";

export async function getComments(page:number): Promise<CommentsType> {
  return await api.get(`/v3/comments?page=${page}`).then((res) => res.data);
}

export async function addComment(text:string, parentId?:number): Promise<CommentsType[]> {
  const updateContent = {
    body: text,
    parentId: parentId
  }
  return await api.post("/v3/comments", updateContent).then((res) => res.data);
}