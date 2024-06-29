import { OkResponse } from "@core/types/api";
import type {
  Member,
  UpdateApiKeyRequest,
  UpdateMainCharacterRequest,
} from "@core/types/member";

import mainAxios from "./mainAxios";

export const getMyInformation = (): Promise<Member> => {
  return mainAxios.get("/v4/member").then((res) => res.data);
};

export const updateMainCharacter = ({
  mainCharacter,
}: UpdateMainCharacterRequest): Promise<OkResponse> => {
  return mainAxios
    .patch("/v4/member/main-character", { mainCharacter })
    .then((res) => res.data);
};

export const updateApikey = ({
  apiKey,
}: UpdateApiKeyRequest): Promise<OkResponse> => {
  return mainAxios
    .patch("/v4/member/api-key", { apiKey })
    .then((res) => res.data);
};

export const resetCharacters = (): Promise<OkResponse> => {
  return mainAxios.delete("/v4/member/characters").then((res) => res.data);
};
