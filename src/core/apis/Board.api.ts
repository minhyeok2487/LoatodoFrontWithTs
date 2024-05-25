import { BoardType, BoardsDto } from "../types/BoardResonse";
import api from "./api";

export async function getBoards(
  page: number,
  size: number
): Promise<BoardsDto> {
  return await api
    .get(`/v3/boards?page=${page}&size=${size}`)
    .then((res) => res.data);
}

// 단건 조회
export async function select(no: string): Promise<BoardType> {
  return await api.get(`/v3/boards/${no}`).then((res) => res.data);
}

// 등록
export async function insert(
  title: string,
  content: string,
  fileNames: string[]
): Promise<BoardType> {
  const updateContent = {
    title: title,
    content: content,
    fileNames: fileNames,
  };
  return await api.post("/v3/boards/", updateContent).then((res) => res.data);
}
