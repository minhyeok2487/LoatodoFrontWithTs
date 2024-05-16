import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { CharacterType, TodoType, WeekContnetType } from "../types/Character.type";
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

// 캐릭터 주간 레이드 업데이트(추가/삭제)
export async function updateWeekTodo(
  character: CharacterType,
  content: WeekContnetType
): Promise<any> {
  return await api
    .post("/v2/character/week/raid/" + character.characterId + "/" + character.characterName, content)
    .then((res) => res.data);
}

// 캐릭터 주간 레이드 업데이트(추가/삭제) All
export async function updateWeekTodoAll(
  character: CharacterType,
  content: WeekContnetType[]
): Promise<any> {
  return await api
    .post("/v2/character/week/raid/" + character.characterId + "/" + character.characterName + "/all", content)
    .then((res) => res.data);
}

// 캐릭터 주간 숙제 체크
export async function updateWeekCheck(
  character: CharacterType,
  todo: TodoType
): Promise<any> {
  const updateContent = {
    characterId: character.characterId,
    characterName: character.characterName,
    weekCategory: todo.weekCategory,
    currentGate: todo.currentGate,
    totalGate: todo.totalGate
  };
  return await api
    .patch("/v2/character/week/raid/check", updateContent)
    .then((res) => res.data);
}

// 캐릭터 주간 숙제 체크 All
export async function updateWeekCheckAll(
  character: CharacterType,
  todo: TodoType
): Promise<any> {
  const updateContent = {
    characterId: character.characterId,
    characterName: character.characterName,
    weekCategory: todo.weekCategory
  };
  return await api
    .patch("/v2/character/week/raid/check/all", updateContent)
    .then((res) => res.data);
}

// 골드획득 캐릭터 업데이트
export async function updateGoldCharacter(
  character: CharacterType,
): Promise<any> {
  const updateContent = {
    characterId: character.characterId,
    characterName: character.characterName
  };
  return await api
    .patch("/v2/character/gold-character/", updateContent)
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

