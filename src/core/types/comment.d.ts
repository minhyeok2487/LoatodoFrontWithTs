export interface ActiveComment {
  id: number;
  type: "REPLY" | "EDIT";
}

export interface GetCommentsRequest {
  page: number;
}

export interface GetCommentsResponse {
  data: CommentItem[];
  totalPages: number;
}

export interface CommentItem {
  id: number;
  body: string;
  username: string;
  parentId: number;
  regDate: string;
  memberId: number;
  role: string;
}

export interface AddCommentRequest {
  parentId?: number;
  body: string;
}

export interface EditCommentRequest {
  id: number;
  body: string;
}
