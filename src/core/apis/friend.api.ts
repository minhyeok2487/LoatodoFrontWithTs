import { OkResponse } from "@core/types/api";
import { Character, Todo, WeeklyRaid } from "@core/types/character";
import {
  Friend,
  FriendSettings,
  GetFriendWeeklyRaidsRequest,
  SearchCharacterItem,
} from "@core/types/friend";

import mainAxios from "./mainAxios";

export const getFriends = (): Promise<Friend[]> => {
  return mainAxios.get("/v4/friends").then((res) => res.data);
};

// 캐릭터 검색
export const searchCharacter = (
  searchName: string
): Promise<SearchCharacterItem[]> => {
  return mainAxios
    .get(`/v2/friends/character/${searchName}`)
    .then((res) => res.data);
};

// 캐릭터 주간 레이드 추가 폼 데이터 호출
export const getFriendWeeklyRaids = ({
  friendUsername,
  characterId,
}: GetFriendWeeklyRaidsRequest): Promise<WeeklyRaid[]> => {
  return mainAxios
    .get(`/v4/friends/week/form/${friendUsername}/${characterId}`)
    .then((res) => res.data);
};

// 깐부 요청
export const requestFriend = (searchName: string): Promise<any> => {
  return mainAxios.post(`/v2/friends/${searchName}`).then((res) => res.data);
};

export const handleRequest = (
  category: string,
  fromMember: string
): Promise<any> => {
  return mainAxios
    .patch(`/v2/friends/${fromMember}/${category}`)
    .then((res) => res.data);
};

export const removeFriend = (friendId: number): Promise<OkResponse> => {
  return mainAxios.delete(`/v4/friends/${friendId}`);
};

// 깐부 설정 변경
export const editFriendSetting = (
  friendId: number,
  settingName: string,
  checked: boolean
): Promise<FriendSettings> => {
  const updateContent = {
    id: friendId,
    name: settingName,
    value: checked,
  };
  return mainAxios
    .patch("/v2/friends/settings", updateContent)
    .then((res) => res.data);
};

// 캐릭터 순서 변경 저장
export const saveSort = (
  friend: Friend,
  characters: Character[]
): Promise<any> => {
  return mainAxios
    .patch(
      `/v2/friends/characterList/sorting/${friend.friendUsername}`,
      characters
    )
    .then((res) => res.data);
};

// --------------------- character.api와 공동 작업

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
    .patch(`/v2/friends/day-content/check/${category}`, data)
    .then((res) => res.data);
};

// 일일 숙제 단일 체크
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
    .patch(`/v2/friends/day-content/check/${category}/all`, data)
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
    .patch("/v2/friends/day-content/gauge", data)
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
    .patch("/v2/friends/raid/check", updateContent)
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
    .patch("/v2/friends/raid/check/all", updateContent)
    .then((res) => res.data);
};

/* 주간 에포나 체크 */
export const weekEponaCheck = (character: Character): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };

  return mainAxios
    .patch("/v2/friends/epona", updateContent)
    .then((res) => res.data);
};

/* 주간 에포나 체크 ALL */
export const weekEponaCheckAll = (character: Character): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };

  return mainAxios
    .patch("/v2/friends/epona/all", updateContent)
    .then((res) => res.data);
};

/* 실마엘 체크 */
export const silmaelChange = (character: Character): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };

  return mainAxios
    .patch("/v2/friends/silmael", updateContent)
    .then((res) => res.data);
};

/* 큐브 티켓 추가 */
export const addCubeTicket = (character: Character): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };

  return mainAxios
    .patch("/v2/friends/cube/add", updateContent)
    .then((res) => res.data);
};

/* 큐브 티켓 감소 */
export const substractCubeTicket = (character: Character): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };

  return mainAxios
    .patch("/v2/friends/cube/substract", updateContent)
    .then((res) => res.data);
};
