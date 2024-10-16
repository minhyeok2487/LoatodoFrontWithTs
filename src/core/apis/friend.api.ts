import { NoDataResponse } from "@core/types/api";
import {
  Friend,
  FriendSettings,
  HandleFriendRequest,
  SearchCharacterItem,
  UpdateFriendSettingRequest,
} from "@core/types/friend";

import mainAxios from "./mainAxios";

export const getFriends = (): Promise<Friend[]> => {
  return mainAxios.get("/v4/friends").then((res) => res.data);
};

// 캐릭터 검색
export const searchCharacter = (
  searchTerm: string
): Promise<SearchCharacterItem[]> => {
  return mainAxios
    .get(`/v2/friends/character/${searchTerm}`)
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
