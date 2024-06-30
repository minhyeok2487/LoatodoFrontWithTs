import { NoDataResponse } from "@core/types/api";
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
}: UpdateMainCharacterRequest): Promise<NoDataResponse> => {
  return mainAxios.patch("/v4/member/main-character", { mainCharacter });
};

export const updateApikey = ({
  apiKey,
}: UpdateApiKeyRequest): Promise<NoDataResponse> => {
  return mainAxios.patch("/v4/member/api-key", { apiKey });
};

export const resetCharacters = (): Promise<NoDataResponse> => {
  return mainAxios.delete("/v4/member/characters");
};
