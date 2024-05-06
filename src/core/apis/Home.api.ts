import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { HomeResponse } from "../types/HomeResponse";
import { NoticesDto } from "../types/NoticeResponse";

export async function getHomeData(): Promise<HomeResponse> {
  return await api.get("/v3/home/test").then((res) => res.data);
}

export function useHome() {
  return useQuery<HomeResponse, Error>({
    queryKey: ["home"],
    queryFn: getHomeData,
  });
}

export async function getNotices(page: number, size: number): Promise<NoticesDto> {
  return await api.get(`/v3/notices?page=${page}&size=${size}`).then((res) => res.data);
}
