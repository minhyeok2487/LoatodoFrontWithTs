import type { NoDataResponse } from "@core/types/api";
import type {
  AddCubeCharacterRequest,
  CubeCharacter,
  CubeReward,
  UpdateCubeCharacterRequest,
} from "@core/types/cube";

import mainAxios from "./mainAxios";

// 큐브 통계 데이터 조회
export const getCubeStatistics = (): Promise<CubeReward[]> => {
  return mainAxios.get("/api/v1/cube/statistics").then((res) => res.data);
};

// 큐브 캐릭터 목록 조회
export const getCubeCharacters = (): Promise<CubeCharacter[]> => {
  return mainAxios.get("/api/v1/cube").then((res) => res.data);
};

// 큐브 캐릭터 생성
export const addCubeCharacter = ({
  characterId,
  characterName,
}: AddCubeCharacterRequest): Promise<CubeCharacter> => {
  return mainAxios
    .post("/api/v1/cube", { characterId, characterName })
    .then((res) => res.data);
};

// 캐릭터 큐브 티켓 갯수 수정
export const updateCubeCharacter = ({
  cubeId,
  characterId,
  ban1,
  ban2,
  ban3,
  ban4,
  ban5,
  unlock1,
}: UpdateCubeCharacterRequest): Promise<CubeCharacter> => {
  return mainAxios
    .put("/api/v1/cube", {
      cubeId,
      characterId,
      ban1,
      ban2,
      ban3,
      ban4,
      ban5,
      unlock1,
    })
    .then((res) => res.data);
};

export const removeCubeCharacter = (
  characterId: number
): Promise<NoDataResponse> => {
  return mainAxios.delete(`/api/v1/cube/${characterId}`);
};
