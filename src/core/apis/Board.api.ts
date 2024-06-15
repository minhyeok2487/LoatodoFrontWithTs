import { BoardType, BoardsDto } from "@core/types/BoardResonse";

import api from "./api";

export const getBoards = (page: number, size: number): Promise<BoardsDto> => {
  return api
    .get(`/v3/boards?page=${page}&size=${size}`)
    .then((res) => res.data);
};

// 단건 조회
export const select = (no: string): Promise<BoardType> => {
  return api.get(`/v3/boards/${no}`).then((res) => res.data);
};

// 등록
export const insert = (
  title: string,
  content: string,
  fileNames: string[]
): Promise<BoardType> => {
  const updateContent = {
    title,
    content,
    fileNames,
  };
  return api.post("/v3/boards/", updateContent).then((res) => res.data);
};
