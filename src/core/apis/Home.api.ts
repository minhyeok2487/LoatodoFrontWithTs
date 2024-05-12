import api from "./api";
import { NoticesDto } from "../types/NoticeResponse";

export async function getNotices(page: number, size: number): Promise<NoticesDto> {
  return await api.get(`/v3/notices?page=${page}&size=${size}`).then((res) => res.data);
}
