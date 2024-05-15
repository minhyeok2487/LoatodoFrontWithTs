import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { CharacterType, WeekContnetType } from "../types/Character.type";
import { STALE_TIME_MS } from "../Constants";

export async function getCharacters(): Promise<CharacterType[]> {
  return await api.get("/v4/characters").then((res) => res.data);
}

export function useCharacters() {
  return useQuery<CharacterType[], Error>({
    queryKey: ["character"],
    queryFn: getCharacters,
    staleTime: STALE_TIME_MS, // 1분간격으로 전송
    retry: 0, // 에러 뜨면 멈춤
  });
}

export async function updateChallenge(
  servername: String,
  content: String
): Promise<any> {
  return await api
    .patch(`/v4/characters/todo/challenge/${servername}/${content}`)
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
    .patch(`/v3/character/day-content/check/${category}`, data)
    .then((res) => res.data);
}

// 일일 숙제 전체 체크
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
    .patch(`/v3/character/day-content/check/${category}/all`, data)
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
    .patch("/v2/character/day-content/gauge", data)
    .then((res) => res.data);
}

// 캐릭터 주간 레이드 추가 폼 데이터 호출
export async function getTodoFormData(
  characterId: Number,
  characterName: String
): Promise<WeekContnetType[]> {
  return await api
    .get("/v2/character/week/form/" + characterId + "/" + characterName)
    .then((res) => res.data);
}

// 캐릭터 주간 레이드 순서 변경
export async function saveRaidSort(character: CharacterType): Promise<any> {
  const characterId = character.characterId;
  const characterName = character.characterName;
  const data = character.todoList.map((todo, index) => ({
    weekCategory: todo.weekCategory,
    sortNumber: index + 1,
  }));
  return await api
    .put("/v2/character/week/raid/" + characterId + "/" + characterName + "/sort", data)
    .then((res) => res.data);
}
