import type { NoDataResponse } from "@core/types/api";
import type {
  Character, UpdateCharacterNameRequest, UpdateCharacterRequest, UpdateCharacterSettingRequest,
} from "@core/types/character";

import mainAxios from "./mainAxios";

// 캐릭터 목록 조회
export const getCharacters = (): Promise<Character[]> => {
  return mainAxios.get("/api/v1/character-list").then((res) => res.data);
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

// 캐릭터 상태변경(삭제/복구)
export const updateCharacterStatus = (
  characterId: number,
  friendUsername?: string
): Promise<NoDataResponse> => {
  return mainAxios.patch("/api/v1/character/deleted", { characterId }, { params: { friendUsername } });
};

// 단건 캐릭터 업데이트
export const updateCharacter = ({
  characterId,
  friendUsername
}: UpdateCharacterRequest): Promise<Character> => {
  return mainAxios.put("/api/v1/character", { characterId }, { params: { friendUsername } }).then((res) => res.data);
};

// 캐릭터 추가
export const addCharacter = (
  characterName: string
): Promise<NoDataResponse> => {
  return mainAxios.post("/api/v1/character", { characterName });
};

// 단건 캐릭터 업데이트
export const updateCharacterName = ({
  characterId,
  characterName,
  friendUsername
}: UpdateCharacterNameRequest): Promise<Character> => {
  return mainAxios.patch("/api/v1/character/name", { characterId, characterName }, { params: { friendUsername } }).then((res) => res.data);
};