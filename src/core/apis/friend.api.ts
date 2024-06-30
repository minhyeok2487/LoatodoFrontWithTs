import { NoDataResponse, UpdateWeeklyTodoAction } from "@core/types/api";
import { Character, WeeklyRaid } from "@core/types/character";
import {
  Friend,
  FriendSettings,
  GetAvaiableFriendWeeklyRaidsRequest,
  SaveFriendCharactersSortRequest,
  SearchCharacterItem,
  UpdateFriendDailyTodoRequest,
  UpdateFriendRestGaugeRequest,
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

// 캐릭터 검색
export const searchCharacter = (
  searchName: string
): Promise<SearchCharacterItem[]> => {
  return mainAxios
    .get(`/v2/friends/character/${searchName}`)
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

// --------------------- character.api와 공동 작업

export const updateDailyTodo = ({
  params,
  allCheck,
}: {
  params: UpdateFriendDailyTodoRequest;
  allCheck: boolean;
}): Promise<Character> => {
  const url = allCheck
    ? `/v2/friends/day-content/check/${params.category}/all`
    : `/v2/friends/day-content/check/${params.category}`;

  return mainAxios
    .patch(url, {
      characterId: params.characterId,
      characterName: params.characterName,
    })
    .then((res) => res.data);
};

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
