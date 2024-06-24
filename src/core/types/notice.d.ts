export type NoticeType = "LoaTodo" | "Lostark";

export type Notices = {
  id: number;
  type: string;
  title: string;
  date: string; // Assuming date is represented as a string
  link: string;
};

export type NoticesDto = {
  noticesList: Notices[];
  totalPages: number;
  page: number;
};
