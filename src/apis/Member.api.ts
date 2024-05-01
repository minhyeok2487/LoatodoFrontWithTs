import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { MemberResponse } from "../types/MemberResponse";
const STALE_TIME_MS = 60000;

export async function getMemberData(): Promise<MemberResponse> {
  return await api.get("/v3/member/characters").then((res) => res.data);
}

export function useMemberData() {
  return useQuery<MemberResponse, Error>({
    queryKey: ["member"],
    queryFn: getMemberData,
    staleTime: STALE_TIME_MS, // 1분간격으로 전송
    retry: 0, // 에러 뜨면 멈춤
  });
}
