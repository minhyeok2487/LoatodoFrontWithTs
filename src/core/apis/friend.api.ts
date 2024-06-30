import { NoDataResponse, UpdateWeeklyTodoAction } from "@core/types/api";
import { Character, Todo, WeeklyRaid } from "@core/types/character";
import {
  Friend,
  FriendSettings,
  GetFriendWeeklyRaidsRequest,
  SaveFriendCharactersSortRequest,
  SearchCharacterItem,
  UpdateFriendWeeklyTodoRequest,
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
export const getWeeklyRaids = ({
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

export const removeFriend = (friendId: number): Promise<NoDataResponse> => {
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

// 캐릭터 순서 변경
export const saveCharactersSort = ({
  friendUserName,
  sortCharacters,
}: SaveFriendCharactersSortRequest): Promise<Character[]> => {
  return mainAxios
    .patch(
      `/v2/friends/characterList/sorting/${friendUserName}`,
      sortCharacters
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

// 깐부 주간 컨텐츠 업데이트
export const updateWeeklyTodo = ({
  params,
  action,
}: {
  params: UpdateFriendWeeklyTodoRequest;
  action: UpdateWeeklyTodoAction;
}): Promise<Character> => {
  const url = (() => {
    switch (action) {
      case "UPDATE_WEEKLY_EPONA":
        return "/v2/friends/epona";
      case "UPDATE_WEEKLY_EPONA_ALL":
        return "/v2/friends/epona/all";
      case "TOGGLE_SILMAEL_EXCHANGE":
        return "/v2/friends/silmael";
      case "SUBSCTRACT_CUBE_TICKET":
        return "/v2/friends/cube/substract";
      case "ADD_CUBE_TICKET":
        return "/v2/friends/cube/add";
      default:
        return "/v2/friends/epona";
    }
  })();

  return mainAxios.patch(url, params).then((res) => res.data);
};
