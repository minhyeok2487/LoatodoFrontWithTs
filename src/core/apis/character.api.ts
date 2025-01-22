import type { NoDataResponse } from "@core/types/api";
import type {
  Character, UpdateCharacterSettingRequest,
} from "@core/types/character";

import mainAxios from "./mainAxios";

// 캐릭터 목록 조회
export const getCharacters = (): Promise<Character[]> => {
  return mainAxios.get("/api/v1/character-list").then((res) => res.data);
};

// 캐릭터 삭제
export const removeCharacter = (
  characterId: number
): Promise<NoDataResponse> => {
  return mainAxios.delete(`/v4/character/${characterId}`);
};

// 캐릭터 출력내용 업데이트
export const updateCharacterSetting = ({
  friendUsername,
  characterId,
  characterName,
  value,
  name,
}: UpdateCharacterSettingRequest): Promise<NoDataResponse> => {
  return mainAxios.patch("/api/v1/character/settings", {
    friendUsername,
    characterId,
    characterName,
    value,
    name,
  });
};

// 삭제된 캐릭터 출력
export const getDeletedCharacters = (
  friendUsername?: string
): Promise<Character[]> => {
  return mainAxios.get("/api/v1/character-list/deleted", { params: { friendUsername } }).then((res) => res.data);
};

// 캐릭터 삭제 복구
export const recoveryCharacter = (
  characterId: number,
  friendUsername?: string
): Promise<NoDataResponse> => {
  return mainAxios.post("/api/v1/character/deleted", { characterId }, { params: { friendUsername } });
};