import type { NoDataResponse } from "@core/types/api";
import type { LifeEnergySaveRequest, LifeEnergyUpdateRequest } from "@core/types/lifeEnergy";
import mainAxios from "./mainAxios";

export const save = ({
  energy,
  maxEnergy,
  characterName,
  beatrice,
}: LifeEnergySaveRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/api/v1/life-energy", {
    energy,
    maxEnergy,
    characterName,
    beatrice,
  });
};

export const update = ({
  id,
  energy,
  maxEnergy,
  characterName,
  beatrice,
}: LifeEnergyUpdateRequest): Promise<NoDataResponse> => {
  return mainAxios.put("/api/v1/life-energy", {
    id,
    energy,
    maxEnergy,
    characterName,
    beatrice,
  });
};

export const remove = (characterName: string): Promise<NoDataResponse> => {
  return mainAxios.delete(`/api/v1/life-energy/${characterName}`);
};
