import type { ClassName, ServerName } from "@core/types/lostark";

export type Member = {
  memberId: number;
  username: string;
  mainCharacter: MainCharacter;
  role: string;
  adsDate: null | string;
};

export type MainCharacter = {
  serverName: ServerName | null;
  characterName: string | null;
  characterImage: string | null;
  characterClassName: ClassName | null;
  itemLevel: number;
};

export type UpdateMainCharacterRequest = {
  mainCharacter: string;
};

export interface UpdateApiKeyRequest {
  apiKey: string;
}

export interface SaveAdsRequest {
  mail: string;
  name: string;
}

