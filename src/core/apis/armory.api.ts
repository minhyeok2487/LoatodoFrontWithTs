import type { ArmoryResponse, SiblingCharacter } from "@core/types/armory";

import mainAxios from "./mainAxios";

export const getArmory = (characterName: string): Promise<ArmoryResponse> => {
  return mainAxios
    .get("/api/v1/armory", { params: { characterName } })
    .then((res) => res.data);
};

export const getSiblings = (
  characterName: string
): Promise<SiblingCharacter[]> => {
  return mainAxios
    .get("/api/v1/armory/siblings", { params: { characterName } })
    .then((res) => res.data);
};
