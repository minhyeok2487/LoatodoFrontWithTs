import { BoardType, BoardsDto } from "@core/types/BoardResonse";

import mainAxios from "./mainAxios";

export const getBoards = (page: number, size: number): Promise<BoardsDto> => {
  return mainAxios
    .get(`/v3/boards?page=${page}&size=${size}`)
    .then((res) => res.data);
};

// 단건 조회
export const select = (no: string): Promise<BoardType> => {
  return mainAxios.get(`/v3/boards/${no}`).then((res) => res.data);
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
  return mainAxios.post("/v3/boards/", updateContent).then((res) => res.data);
};
