import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { STALE_TIME_MS } from "../Constants";
import { FriendType } from "../types/Friend.type";

export async function getFriends(): Promise<FriendType[]> {
  return await api.get("/v4/friends").then((res) => res.data);
}

export function useFriends() {
  return useQuery<FriendType[], Error>({
    queryKey: ["friends"],
    queryFn: getFriends,
    staleTime: STALE_TIME_MS, // 1분간격으로 전송
    retry: 0, // 에러 뜨면 멈춤
  });
}
