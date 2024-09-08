import type {
  CubeResponse
} from "@core/types/cube";
import type { CubeReward } from "@core/types/character";

import mainAxios from "./mainAxios";

// 큐브 통계 데이터 조회
export const getCubeStatistics = (): Promise<CubeReward[]> => {
  return mainAxios.get("/v4/cube/statistics").then((res) => res.data);
};

// 캐릭터 큐브 목록 조회
export const getCubes = (): Promise<CubeResponse[]> => {
  return mainAxios.get("/v4/cube").then((res) => res.data);
};

// 캐릭터 큐브 생성
export const createCube = (characterId: number, characterName: string): Promise<CubeResponse> => {
  return mainAxios.post("/v4/cube", { characterId, characterName }).then((res) => res.data);
};

// 캐릭터 큐브 티켓 갯수 수정
export const updateCubes = (
  cubeId: number,
  characterId: number,
  ban1: number,
  ban2: number,
  ban3: number,
  ban4: number,
  ban5: number,
  unlock1: number,
): Promise<CubeResponse> => {
  return mainAxios.put("/v4/cube", {   
    cubeId,
    characterId,
    ban1,
    ban2,
    ban3,
    ban4,
    ban5,
    unlock1 
  }).then((res) => res.data);
};

export const deleteCube = (characterId: number): Promise<void> => {
  return mainAxios.delete(`/v4/cube/${characterId}`).then(() => {});
};

