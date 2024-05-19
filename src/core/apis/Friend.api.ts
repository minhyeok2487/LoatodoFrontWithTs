import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { STALE_TIME_MS } from "../Constants";
import { FriendType } from "../types/Friend.type";
import { CharacterType, WeekContnetType } from "../types/Character.type";

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
  friend: FriendType,
  characters: CharacterType[]
): Promise<any> {
  return await api
    .patch(
      "/v2/friends/characterList/sorting/" + friend.friendUsername,
      characters
    )
    .then((res) => res.data);
}

// 일일 숙제 단일 체크
export async function updateDayContent(
  characterId: Number,
  characterName: String,
  category: String
): Promise<any> {
  const data = {
    characterId: characterId,
    characterName: characterName,
  };
  return await api
    .patch("/v2/friends/day-content/check/" + category, data)
    .then((res) => res.data);
}

// 일일 숙제 단일 체크
export async function updateDayContentAll(
  characterId: Number,
  characterName: String,
  category: String
): Promise<any> {
  const data = {
    characterId: characterId,
    characterName: characterName,
  };
  return await api
    .patch("/v2/friends/day-content/check/" + category +"/all", data)
    .then((res) => res.data);
}

// 캐릭터 휴식 게이지 수정
export async function updateDayContentGuage(
  characterId: Number,
  characterName: String,
  chaosGauge: Number,
  guardianGauge: Number,
  eponaGauge: Number
): Promise<any> {
  const data = {
    characterId: characterId,
    characterName: characterName,
    chaosGauge: chaosGauge,
    guardianGauge: guardianGauge,
    eponaGauge: eponaGauge,
  };
  return await api
    .patch("/v2/friends/day-content/gauge", data)
    .then((res) => res.data);
}

// 캐릭터 주간 레이드 추가 폼 데이터 호출
export async function getTodoFormData(
  friend: FriendType,
  character: CharacterType,
): Promise<WeekContnetType[]> {
  return await api
    .get("/v4/friends/week/form/" + friend.friendUsername + "/" + character.characterId)
    .then((res) => res.data);
}