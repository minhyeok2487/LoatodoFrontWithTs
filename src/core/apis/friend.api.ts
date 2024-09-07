import { NoDataResponse, UpdateWeeklyTodoAction } from "@core/types/api";
import { Character, WeeklyRaid } from "@core/types/character";
import {
  Friend,
  FriendSettings,
  GetAvaiableFriendWeeklyRaidsRequest,
  HandleFriendRequest,
  SaveFriendCharactersSortRequest,
  SearchCharacterItem,
  UpdateFriendCharacterMemoRequest,
  UpdateFriendRestGaugeRequest,
  UpdateFriendSettingRequest,
  UpdateFriendTodoRaidListRequest,
  UpdateFriendWeeklyRaidTodoRequest,
  UpdateFriendWeeklyTodoRequest,
} from "@core/types/friend";

import mainAxios from "./mainAxios";

export const getFriends = (): Promise<Friend[]> => {
  return mainAxios.get("/v4/friends").then((res) => res.data);
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

// 캐릭터 메모 수정
export const updateCharacterMemo = ({
  friendUsername,
  characterId,
  memo,
}: UpdateFriendCharacterMemoRequest): Promise<NoDataResponse> => {
  return mainAxios
    .post(`/v4/friends/character/${friendUsername}/memo`, { characterId, memo })
    .then((res) => res.data);
};

// 캐릭터 검색
export const searchCharacter = (
  searchTerm: string
): Promise<SearchCharacterItem[]> => {
  return mainAxios
    .get(`/v2/friends/character/${searchTerm}`)
    .then((res) => res.data);
};

// 캐릭터 주간 레이드 추가 폼 데이터 호출
export const getAvailableWeeklyRaids = ({
  friendUsername,
  characterId,
}: GetAvaiableFriendWeeklyRaidsRequest): Promise<WeeklyRaid[]> => {
  return mainAxios
    .get(`/v4/friends/week/form/${friendUsername}/${characterId}`)
    .then((res) => res.data);
};

// 깐부 요청
export const sendFriendRequest = (
  username: string
): Promise<NoDataResponse> => {
  return mainAxios.post(`/v2/friends/${username}`);
};

export const handleFriendRequest = ({
  action,
  fromUsername,
}: HandleFriendRequest): Promise<NoDataResponse> => {
  return mainAxios.patch(`/v2/friends/${fromUsername}/${action}`);
};

export const removeFriend = (friendId: number): Promise<NoDataResponse> => {
  return mainAxios.delete(`/v4/friends/${friendId}`);
};

// 깐부 설정 변경
export const updateFriendSetting = ({
  id,
  name,
  value,
}: UpdateFriendSettingRequest): Promise<FriendSettings> => {
  return mainAxios
    .patch("/v2/friends/settings", {
      id,
      name,
      value,
    })
    .then((res) => res.data);
};

export const updateTodoRaidList = ({
  friendCharacterId,
  friendUsername,
  weekContentIdList,
}: UpdateFriendTodoRaidListRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/v4/friends/raid", {
    friendCharacterId,
    friendUsername,
    weekContentIdList,
  });
};

// ----------- todoList start
// 캐릭터 휴식 게이지 수정
export const updateRestGauge = ({
  characterId,
  characterName,
  eponaGauge,
  chaosGauge,
  guardianGauge,
}: UpdateFriendRestGaugeRequest): Promise<Character> => {
  return mainAxios
    .patch("/v2/friends/day-content/gauge", {
      characterId,
      characterName,
      eponaGauge,
      chaosGauge,
      guardianGauge,
    })
    .then((res) => res.data);
};

export const updateWeeklyRaidTodo = (
  params: UpdateFriendWeeklyRaidTodoRequest
): Promise<Character> => {
  const url = params.allCheck
    ? "/v2/friends/raid/check/all"
    : "/v2/friends/raid/check";

  return mainAxios
    .patch(
      url,
      params.allCheck
        ? {
            characterId: params.characterId,
            characterName: params.characterName,
            weekCategory: params.weekCategory,
          }
        : {
            characterId: params.characterId,
            characterName: params.characterName,
            weekCategory: params.weekCategory,
            currentGate: params.currentGate,
            totalGate: params.totalGatte,
          }
    )
    .then((res) => res.data);
};
