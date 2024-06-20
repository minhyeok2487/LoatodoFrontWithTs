import { useQuery, useQueryClient } from "@tanstack/react-query";

import { STALE_TIME_MS } from "@core/constants";
import {
  CharacterType,
  CubeRewards,
  TodoType,
  WeekContnetType,
} from "@core/types/Character.type";

import mainAxios from "./mainAxios";

export const getCharacters = (): Promise<CharacterType[]> => {
  return mainAxios.get("/v4/characters").then((res) => res.data);
};

export const useCharacters = () => {
  const queryClient = useQueryClient();
  return {
    ...useQuery<CharacterType[], Error>({
      queryKey: ["character"],
      queryFn: getCharacters,
      staleTime: STALE_TIME_MS, // 5 minute interval
      retry: 0, // Stops on error
    }),
    queryClient,
  };
};

// 캐릭터 정보 업데이트
export const updateCharacters = (): Promise<any> => {
  return mainAxios.put("/v4/characters").then((res) => res.data);
};

// 캐릭터 출력내용 업데이트
export const updateSetting = (
  characterId: number,
  characterName: string,
  value: boolean,
  settingName: string
): Promise<any> => {
  const updateContent = {
    characterId,
    characterName,
    value,
    name: settingName,
  };
  return mainAxios
    .patch("/v2/character/settings", updateContent)
    .then((res) => res.data);
};

// 도비스 도가토 체크
export const updateChallenge = (
  servername: string,
  content: string
): Promise<any> => {
  return mainAxios
    .patch(`/v4/characters/todo/challenge/${servername}/${content}`)
    .then((res) => res.data);
};

// 캐릭터 순서 변경 저장
export const saveSort = (characters: CharacterType[]): Promise<any> => {
  return mainAxios
    .patch("/v4/characters/sorting", characters)
    .then((res) => res.data);
};

// 일일 숙제 단일 체크
export const updateDayContent = (
  characterId: number,
  characterName: string,
  category: string
): Promise<any> => {
  const data = {
    characterId,
    characterName,
  };

  return mainAxios
    .patch(`/v3/character/day-content/check/${category}`, data)
    .then((res) => res.data);
};

// 일일 숙제 전체 체크
export const updateDayContentAll = (
  characterId: number,
  characterName: string,
  category: string
): Promise<any> => {
  const data = {
    characterId,
    characterName,
  };

  return mainAxios
    .patch(`/v3/character/day-content/check/${category}/all`, data)
    .then((res) => res.data);
};

// 캐릭터 휴식 게이지 수정
export const updateDayContentGuage = (
  characterId: number,
  characterName: string,
  chaosGauge: number,
  guardianGauge: number,
  eponaGauge: number
): Promise<any> => {
  const data = {
    characterId,
    characterName,
    chaosGauge,
    guardianGauge,
    eponaGauge,
  };
  return mainAxios
    .patch("/v2/character/day-content/gauge", data)
    .then((res) => res.data);
};

// 골드 체크 버전 변경
export const updateGoldCheckVersion = (
  character: CharacterType
): Promise<any> => {
  const data = {
    characterId: character.characterId,
    characterName: character.characterName,
  };

  return mainAxios
    .patch("/v3/character/settings/gold-check-version", data)
    .then((res) => res.data);
};

// 컨텐츠 골드 획득 지정/해제
export const updateCheckGold = (
  character: CharacterType,
  weekCategory: string,
  updateValue: boolean
): Promise<any> => {
  const data = {
    characterId: character.characterId,
    characterName: character.characterName,
    weekCategory,
    updateValue,
  };

  return mainAxios
    .patch("/v3/character/week/raid/gold-check", data)
    .then((res) => res.data);
};

// 캐릭터 주간 레이드 추가 폼 데이터 호출
export const getTodoFormData = (
  characterId: number,
  characterName: string
): Promise<WeekContnetType[]> => {
  return mainAxios
    .get(`/v2/character/week/form/${characterId}/${characterName}`)
    .then((res) => res.data);
};

// 캐릭터 주간 레이드 업데이트(추가/삭제)
export const updateWeekTodo = (
  character: CharacterType,
  content: WeekContnetType
): Promise<any> => {
  return mainAxios
    .post(
      `/v2/character/week/raid/${character.characterId}/${character.characterName}`,
      content
    )
    .then((res) => res.data);
};

// 캐릭터 주간 레이드 업데이트(추가/삭제) All
export const updateWeekTodoAll = (
  character: CharacterType,
  content: WeekContnetType[]
): Promise<any> => {
  return mainAxios
    .post(
      `/v2/character/week/raid/${character.characterId}/${character.characterName}/all`,
      content
    )
    .then((res) => res.data);
};

// 캐릭터 주간 숙제 체크
export const updateWeekCheck = (
  character: CharacterType,
  todo: TodoType
): Promise<any> => {
  const updateContent = {
    characterId: character.characterId,
    characterName: character.characterName,
    weekCategory: todo.weekCategory,
    currentGate: todo.currentGate,
    totalGate: todo.totalGate,
  };

  return mainAxios
    .patch("/v2/character/week/raid/check", updateContent)
    .then((res) => res.data);
};

// 캐릭터 주간 숙제 체크 All
export const updateWeekCheckAll = (
  character: CharacterType,
  todo: TodoType
): Promise<any> => {
  const updateContent = {
    characterId: character.characterId,
    characterName: character.characterName,
    weekCategory: todo.weekCategory,
  };

  return mainAxios
    .patch("/v2/character/week/raid/check/all", updateContent)
    .then((res) => res.data);
};

// 골드획득 캐릭터 업데이트
export const updateGoldCharacter = (character: CharacterType): Promise<any> => {
  const updateContent = {
    characterId: character.characterId,
    characterName: character.characterName,
  };

  return mainAxios
    .patch("/v2/character/gold-character/", updateContent)
    .then((res) => res.data);
};

// 캐릭터 주간 레이드 순서 변경
export const saveRaidSort = (character: CharacterType): Promise<any> => {
  const { characterId, characterName } = character;

  const data = character.todoList.map((todo, index) => ({
    weekCategory: todo.weekCategory,
    sortNumber: index + 1,
  }));

  return mainAxios
    .put(`/v2/character/week/raid/${characterId}/${characterName}/sort`, data)
    .then((res) => res.data);
};

// 캐릭터 주간 레이드 메시지 수정
export const updateWeekMessage = (
  character: CharacterType,
  todoId: number,
  message: string
): Promise<any> => {
  const updateContent = {
    characterId: character.characterId,
    todoId,
    message,
  };
  return mainAxios
    .patch("/v2/character/week/message", updateContent)
    .then((res) => res.data);
};

/* 주간 에포나 체크 */
export const weekEponaCheck = (character: CharacterType): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return mainAxios
    .patch("/v2/character/week/epona", updateContent)
    .then((res) => res.data);
};

/* 주간 에포나 체크 ALL */
export const weekEponaCheckAll = (character: CharacterType): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return mainAxios
    .patch("/v2/character/week/epona/all", updateContent)
    .then((res) => res.data);
};

/* 실마엘 교환 체크 */
export const silmaelChange = (character: CharacterType): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return mainAxios
    .patch("/v2/character/week/silmael", updateContent)
    .then((res) => res.data);
};

/* 큐브 티켓 추가 */
export const addCubeTicket = (character: CharacterType): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return mainAxios
    .patch("/v2/character/week/cube/add", updateContent)
    .then((res) => res.data);
};

/* 큐브 티켓 감소 */
export const substractCubeTicket = (character: CharacterType): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return mainAxios
    .patch("/v2/character/week/cube/substract", updateContent)
    .then((res) => res.data);
};

/* 큐브 데이터 호출 */
export const getCubeContent = (name: string): Promise<CubeRewards> => {
  return mainAxios.get(`/v2/character/cube/${name}`).then((res) => res.data);
};
