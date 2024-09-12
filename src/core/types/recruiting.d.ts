import {
  EXPEDITION_SETTING,
  RECRUITING_CATEGORY,
} from "@core/constants/recruiting";

type Playtime = "MORNING" | "DAY" | "NIGHT" | "DAWN" | "NONE";

export interface Pagination<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}

export interface GetRecruitingsRequest {
  limit: number;
  page: number;
  recruitingCategory: keyof typeof RECRUITING_CATEGORY;
}

export type GetRecruitingsResponse = Pagination<RecruitingItem>;

export interface RecruitingItem {
  recruitingBoardId: number;
  recruitingCategory: keyof typeof RECRUITING_CATEGORY;
  title: string;
  mainCharacterName: string | null;
  itemLevel: number;
  showCount: number;
  createdDate: string;
}

export interface RecruitingDetail {
  authDelete: boolean;
  body: string;
  expeditionSetting: number;
  url: string[];
  weekdaysPlay: Playtime;
  weekendsPlay: Playtime;
}

export interface AddRecruitingRequest {
  body: string;
  expeditionSetting: keyof typeof EXPEDITION_SETTING;
  fileNames: string[];
  recruiteingCategory: keyof typeof RECRUITING_CATEGORY;
  showMainCharacter: boolean;
  title: string;
  url: string[];
  weekdaysPlay: Playtime;
  weekendsPlay: Playtime;
}

export interface AddRecruitingResponse {
  recruitingBoardId: number;
}

export interface AddRecruitingImageResponse {
  fileName: string;
  url: string;
}

export interface EditRecruitingRequest {
  body: string;
  expeditionSetting: keyof typeof EXPEDITION_SETTING;
  showMainCharacter: boolean;
  title: string;
  url1: string;
  url2: string;
  url3: string;
  weekdaysPlay: Playtime;
  weekendsPlay: Playtime;
}
