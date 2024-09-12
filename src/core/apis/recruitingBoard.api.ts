import { RecruitingBoardType } from "@core/types/recruitingBoard";
import mainAxios from "./mainAxios";

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
}

export const searchRecruitingBoard = (
  recruitingCategory: string,
  page: number = 1,
  size: number = 25
): Promise<PageResponse<RecruitingBoardType>> => {
  return mainAxios
    .get("/api/v1/recruiting-board", {
      params: {
        recruitingCategory,
        page,
        size,
      },
    })
    .then((res) => res.data);
};