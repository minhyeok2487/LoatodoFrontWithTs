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
