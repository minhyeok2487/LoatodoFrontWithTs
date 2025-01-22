import { NoDataResponse } from "@core/types/api";
import type {
  Member,
  UpdateApiKeyRequest,
  UpdateMainCharacterRequest,
} from "@core/types/member";

import mainAxios from "./mainAxios";
import type { SaveAdsRequest } from '../types/member';

export const getMyInformation = (): Promise<Member> => {
  return mainAxios.get("/api/v1/member").then((res) => res.data);
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

export const saveAds = ({
  mail, name
}: SaveAdsRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/api/v1/member/ads", { mail, name });
};
