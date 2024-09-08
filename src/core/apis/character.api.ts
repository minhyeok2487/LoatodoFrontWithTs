import type { NoDataResponse } from "@core/types/api";
import type {
  Character,
  CubeName,
  CubeReward,
  ToggleCharacterGoldCheckVersionRequest,
  ToggleOptainableGoldCharacterRequest,
  ToggleOptainableGoldRaidRequest,
  UpdateChallengeRequest,
  UpdateRaidTodoListRequest,
  UpdateRaidTodoRequest,
  UpdateVisibleSettingRequest,
} from "@core/types/character";

import mainAxios from "./mainAxios";

// 캐릭터 목록 조회
export const getCharacters = (): Promise<Character[]> => {
  return mainAxios.get("/v4/characters").then((res) => res.data);
};

// 캐릭터 삭제
export const removeCharacter = (
  characterId: number
): Promise<NoDataResponse> => {
  return mainAxios.delete(`/v4/character/${characterId}`);
};

// 큐브 보상
export const getCubeReward = (name: CubeName): Promise<CubeReward> => {
  return mainAxios.get(`/v2/character/cube/${name}`).then((res) => res.data);
};

// 캐릭터 정보 업데이트
export const refreshCharacters = (): Promise<NoDataResponse> => {
  return mainAxios.put("/v4/characters");
};

// 캐릭터 출력내용 업데이트
export const updateVisibleSetting = ({
  characterId,
  characterName,
  value,
  name,
}: UpdateVisibleSettingRequest): Promise<NoDataResponse> => {
  return mainAxios.patch("/v4/character/settings", {
    characterId,
    characterName,
    value,
    name,
  });
};

// 도비스 도가토 체크
export const updateChallenge = ({
  serverName,
  content,
}: UpdateChallengeRequest): Promise<NoDataResponse> => {
  return mainAxios.patch(
    `/v4/characters/todo/challenge/${serverName}/${content}`
  );
};

// 골드획득 캐릭터 업데이트
export const toggleOptainableGoldCharacter = ({
  characterId,
  characterName,
}: ToggleOptainableGoldCharacterRequest): Promise<Character> => {
  return mainAxios
    .patch("/v4/character/gold-character/", {
      characterId,
      characterName,
    })
    .then((res) => res.data);
};

// 골드 체크 버전 변경
export const toggleCharacterGoldCheckVersion = ({
  characterId,
  characterName,
}: ToggleCharacterGoldCheckVersionRequest): Promise<Character> => {
  return mainAxios
    .patch("/v3/character/settings/gold-check-version", {
      characterId,
      characterName,
    })
    .then((res) => res.data);
};

// 컨텐츠 골드 획득 지정/해제
export const toggleOptainableGoldRaid = ({
  characterId,
  characterName,
  weekCategory,
  updateValue,
}: ToggleOptainableGoldRaidRequest): Promise<NoDataResponse> => {
  return mainAxios.patch("/v3/character/week/raid/gold-check", {
    characterId,
    characterName,
    weekCategory,
    updateValue,
  });
};

// 주간 레이드 업데이트 All
export const updateRaidTodoList = ({
  characterId,
  characterName,
  raids,
}: UpdateRaidTodoListRequest): Promise<Character> => {
  return mainAxios
    .post(`/v2/character/week/raid/${characterId}/${characterName}/all`, raids)
    .then((res) => res.data);
};

// 주간 레이드 관문별 업데이트
export const updateRaidTodo = ({
  characterId,
  characterName,
  raid,
}: UpdateRaidTodoRequest): Promise<Character> => {
  return mainAxios
    .post(`/v2/character/week/raid/${characterId}/${characterName}`, raid)
    .then((res) => res.data);
};
