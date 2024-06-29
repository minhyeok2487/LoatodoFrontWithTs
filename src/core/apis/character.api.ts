import {
  Character,
  CubeName,
  CubeReward,
  GetWeeklyRaidsRequest,
  Todo,
  UpdateChallengeRequest,
  UpdateVisibleSettingRequest,
  WeeklyRaid,
} from "@core/types/character";

import mainAxios from "./mainAxios";

export const getCharacters = (): Promise<Character[]> => {
  return mainAxios.get("/v4/characters").then((res) => res.data);
};

// 캐릭터 주간 레이드 추가 폼 데이터 호출
export const getWeeklyRaids = ({
  characterId,
  characterName,
}: GetWeeklyRaidsRequest): Promise<WeeklyRaid[]> => {
  return mainAxios
    .get(`/v4/character/week-todo/form/${characterId}/${characterName}`)
    .then((res) => res.data);
};

// 큐브 보상
export const getCubeReward = (name: CubeName): Promise<CubeReward> => {
  return mainAxios.get(`/v2/character/cube/${name}`).then((res) => res.data);
};

// 캐릭터 정보 업데이트
export const refreshCharacters = (): Promise<void> => {
  return mainAxios.put("/v4/characters").then((res) => res.data);
};

// 캐릭터 출력내용 업데이트
export const updateVisibleSetting = ({
  characterId,
  characterName,
  value,
  name,
}: UpdateVisibleSettingRequest): Promise<void> => {
  return mainAxios
    .patch("/v4/character/settings", {
      characterId,
      characterName,
      value,
      name,
    })
    .then((res) => res.data);
};

// 도비스 도가토 체크
export const updateChallenge = ({
  serverName,
  content,
}: UpdateChallengeRequest): Promise<void> => {
  return mainAxios
    .patch(`/v4/characters/todo/challenge/${serverName}/${content}`)
    .then((res) => res.data);
};

// 캐릭터 순서 변경 저장
export const saveSort = (characters: Character[]): Promise<any> => {
  return mainAxios
    .patch("/v4/characters/sorting", characters)
    .then((res) => res.data);
};

// 컨텐츠 골드 획득 지정/해제
export const updateCheckGold = (
  character: Character,
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

// 골드 체크 버전 변경
export const updateGoldCheckVersion = (character: Character): Promise<any> => {
  const data = {
    characterId: character.characterId,
    characterName: character.characterName,
  };

  return mainAxios
    .patch("/v3/character/settings/gold-check-version", data)
    .then((res) => res.data);
};

// 캐릭터 주간 레이드 업데이트(추가/삭제)
export const updateWeekTodo = (
  character: Character,
  content: WeeklyRaid
): Promise<any> => {
  return mainAxios
    .post(
      `/v2/character/week/raid/${character.characterId}/${character.characterName}`,
      content
    )
    .then((res) => res.data);
};

// 캐릭터 주간 숙제 체크 All
export const updateWeekCheckAll = (
  character: Character,
  todo: Todo
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
export const updateGoldCharacter = (character: Character): Promise<any> => {
  const updateContent = {
    characterId: character.characterId,
    characterName: character.characterName,
  };

  return mainAxios
    .patch("/v4/character/gold-character/", updateContent)
    .then((res) => res.data);
};

// 캐릭터 주간 레이드 순서 변경
export const saveRaidSort = (character: Character): Promise<any> => {
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
  character: Character,
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

// --------------------- friend.api와 공동 작업

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
    .patch(`/v4/character/day-todo/check/${category}`, data)
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
    .patch(`/v4/character/day-todo/check/${category}/all`, data)
    .then((res) => res.data);
};

// 캐릭터 휴식 게이지 수정
export const updateDayContentGauge = (
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
    .patch("/v4/character/day-todo/gauge", data)
    .then((res) => res.data);
};

// 캐릭터 주간 숙제 체크
export const updateWeekCheck = (
  character: Character,
  todo: Todo
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

// 캐릭터 주간 레이드 업데이트(추가/삭제) All
export const updateWeekTodoAll = (
  character: Character,
  content: WeeklyRaid[]
): Promise<any> => {
  return mainAxios
    .post(
      `/v2/character/week/raid/${character.characterId}/${character.characterName}/all`,
      content
    )
    .then((res) => res.data);
};

/* 주간 에포나 체크 */
export const weekEponaCheck = (character: Character): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return mainAxios
    .patch("/v2/character/week/epona", updateContent)
    .then((res) => res.data);
};

/* 주간 에포나 체크 ALL */
export const weekEponaCheckAll = (character: Character): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return mainAxios
    .patch("/v2/character/week/epona/all", updateContent)
    .then((res) => res.data);
};

/* 실마엘 교환 체크 */
export const silmaelChange = (character: Character): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return mainAxios
    .patch("/v2/character/week/silmael", updateContent)
    .then((res) => res.data);
};

/* 큐브 티켓 추가 */
export const addCubeTicket = (character: Character): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return mainAxios
    .patch("/v2/character/week/cube/add", updateContent)
    .then((res) => res.data);
};

/* 큐브 티켓 감소 */
export const substractCubeTicket = (character: Character): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return mainAxios
    .patch("/v2/character/week/cube/substract", updateContent)
    .then((res) => res.data);
};
