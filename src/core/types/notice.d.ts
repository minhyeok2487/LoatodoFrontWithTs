export type NoticeType = "LOA_TODO" | "OFFICIAL";

export interface GetListRequest {
  page: number;
  size: number;
}

export interface GetNoticesResponse {
  boardResponseDtoList: BoardType[];
  totalPages: number;
  page: number;
}

export interface NoticeItem {
  id: number;
  writer: string;
  title: string;
  content: string;
  views: number;
  regDate: string;
}

export interface GetOfficialNoticesResponse {
  noticesList: OfficialNoticeItem[];
  totalPages: number;
  page: number;
}

export interface OfficialNoticeItem {
  id: number;
  type: string;
  title: string;
  date: string;
  link: string;
}

export interface AddNoticeRequest {
  title: string;
  content: string;
  fileNames: string[];
}
