import type { NoDataResponse } from "@core/types/api";
import type { LifeEnergySaveRequest, LifeEnergyUpdateRequest, LifeEnergySpendRequest } from "@core/types/lifeEnergy";
import type { Member, UpdateLifePotionRequest, UpdateLifePotionsRequest, UsePotionRequest } from "@core/types/member";
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

export const spend = ({
  id,
  energy,
  gold,
  characterName,
}: LifeEnergySpendRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/api/v1/life-energy/spend", {
    id,
    energy,
    gold,
    characterName,
  });
};

// 기존 delta 방식 (+/- 증감) API - 향후 제거 예정
export const updatePotion = (
  request: UpdateLifePotionRequest
): Promise<Member> => {
  return mainAxios
    .post("/api/v1/life-energy/potion", request)
    .then((res) => res.data);
};

// 절대값 일괄 저장 API
export const updatePotions = (
  request: UpdateLifePotionsRequest
): Promise<Member> => {
  return mainAxios
    .put("/api/v1/life-energy/potions", request)
    .then((res) => res.data);
};

export const usePotion = (
  request: UsePotionRequest
): Promise<Member> => {
  return mainAxios
    .post("/api/v1/life-energy/potion/use", request)
    .then((res) => res.data);
};
