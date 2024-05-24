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

export async function select(
  no: string
): Promise<BoardType> {
  return await api
    .get(`/v3/boards/${no}`)
    .then((res) => res.data);
}