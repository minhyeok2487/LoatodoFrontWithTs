import { NoDataResponse } from "@core/types/api";
import {
  Friend,
  FriendSettings,
  HandleFriendRequest,
  SearchCharacterItem,
  SendFriendRequest,
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
    .get(`/api/v1/friend/character/${searchTerm}`)
    .then((res) => res.data);
};

// 깐부 요청
export const sendFriendRequest = ({
  friendUsername,
}: SendFriendRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/api/v1/friend", { friendUsername });
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
    .patch("/api/v1/friend/settings", {
      id,
      name,
      value,
    })
    .then((res) => res.data);
};
