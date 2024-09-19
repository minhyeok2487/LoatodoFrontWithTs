export interface ActiveComment {
  id: number;
  type: "REPLY" | "EDIT";
}

export interface GetCommentsRequest {
  page: number;
}

export interface GetCommentsResponse {
  commentDtoList: CommentItem[];
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

export interface GetCommentsRequestV2 {
  commentsId?: number;
}

export interface GetCommentsResponseV2 {
  content: CommentItemV2[];
  hasNext: boolean;
}

export interface CommentItemV2 {
  commentId: number;
  body: string;
  username: string;
  parentId: number;
  regDate: string;
  memberId: number;
  likeCount: number;
  commentCount: number;
  role: string;
}