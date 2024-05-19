import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { STALE_TIME_MS } from "../Constants";
import { FriendType } from "../types/Friend.type";
import { CharacterType } from "../types/Character.type";

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

// 도비스 도가토 체크
// export async function updateChallenge(
//   friend: FriendType,
//   servername: String,
//   content: String
// ): Promise<any> {
//   return await api
//     .patch(`/v4/characters/todo/challenge/${servername}/${content}`)
//     .then((res) => res.data);
// }

// 캐릭터 순서 변경 저장
export async function saveSort(
  friend:FriendType,
  characters:CharacterType[]
): Promise<any> {
  return await api
    .patch("/v2/friends/characterList/sorting/" +friend.friendUsername, characters)
    .then((res) => res.data);
}