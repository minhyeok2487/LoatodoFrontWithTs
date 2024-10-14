export interface RecruitingBoardType {
  recruitingBoardId: number;
  recruitingCategory: RecruitingCategory;
  title: string;
  mainCharacterName: string | null;
  itemLevel: number;
  createdDate: string;
  showCount: number;
}

export type RecruitingCategory = "FRIENDS" | "RECRUITING_GUILD" | "LOOKING_GUILD" | "RECRUITING_PARTY" | "LOOKING_PARTY" | "ETC";

