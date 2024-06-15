import { useQuery } from "@tanstack/react-query";

import { STALE_TIME_MS } from "@core/constants";
import {
  CharacterType,
  TodoType,
  WeekContnetType,
} from "@core/types/Character.type";
import { FriendSettings, FriendType } from "@core/types/Friend.type";

import api from "./api";

export const getFriends = (): Promise<FriendType[]> => {
  return api.get("/v4/friends").then((res) => res.data);
};

export const useFriends = () => {
  return useQuery<FriendType[], Error>({
    queryKey: ["friends"],
    queryFn: getFriends,
    staleTime: STALE_TIME_MS, // 1분간격으로 전송
    retry: 0, // 에러 뜨면 멈춤
  });
};

export type SearchCharacterResponseType = {
  areWeFriend: string;
  characterListSize: number;
  characterName: string;
  id: number;
  username: string;
};

// 캐릭터 검색
export const searchCharacter = (
  searchName: string
): Promise<SearchCharacterResponseType[]> => {
  return api.get(`/v2/friends/character/${searchName}`).then((res) => res.data);
};

// 깐부 요청
export const requestFriend = (searchName: string): Promise<any> => {
  return api.post(`/v2/friends/${searchName}`).then((res) => res.data);
};

export const handleRequest = (
  category: string,
  fromMember: string
): Promise<any> => {
  return api
    .patch(`/v2/friends/${fromMember}/${category}`)
    .then((res) => res.data);
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
  return api
    .patch("/v2/friends/settings", updateContent)
    .then((res) => res.data);
};

// 도비스 도가토 체크
// export const updateChallenge = (
//   friend: FriendType,
//   servername: String,
//   content: String
// ): Promise<any> => {
//   return await api
//     .patch(`/v4/characters/todo/challenge/${servername}/${content}`)
//     .then((res) => res.data);
// }

// 캐릭터 순서 변경 저장
export const saveSort = (
  friend: FriendType,
  characters: CharacterType[]
): Promise<any> => {
  return api
    .patch(
      `/v2/friends/characterList/sorting/${friend.friendUsername}`,
      characters
    )
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

  return api
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

  return api
    .patch(`/v2/friends/day-content/check/${category}/all`, data)
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

  return api
    .patch("/v2/friends/day-content/gauge", data)
    .then((res) => res.data);
};

// 캐릭터 주간 레이드 추가 폼 데이터 호출
export const getTodoFormData = (
  friend: FriendType,
  character: CharacterType
): Promise<WeekContnetType[]> => {
  return api
    .get(
      `/v4/friends/week/form/${friend.friendUsername}/${character.characterId}`
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

  return api
    .patch("/v2/friends/raid/check", updateContent)
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

  return api
    .patch("/v2/friends/raid/check/all", updateContent)
    .then((res) => res.data);
};

/* 주간 에포나 체크 */
export const weekEponaCheck = (character: CharacterType): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };

  return api.patch("/v2/friends/epona", updateContent).then((res) => res.data);
};

/* 주간 에포나 체크 ALL */
export const weekEponaCheckAll = (character: CharacterType): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };

  return api
    .patch("/v2/friends/epona/all", updateContent)
    .then((res) => res.data);
};

/* 실마엘 체크 */
export const silmaelChange = (character: CharacterType): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };

  return api
    .patch("/v2/friends/silmael", updateContent)
    .then((res) => res.data);
};

/* 큐브 티켓 추가 */
export const addCubeTicket = (character: CharacterType): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };

  return api
    .patch("/v2/friends/cube/add", updateContent)
    .then((res) => res.data);
};

/* 큐브 티켓 감소 */
export const substractCubeTicket = (character: CharacterType): Promise<any> => {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };

  return api
    .patch("/v2/friends/cube/substract", updateContent)
    .then((res) => res.data);
};
