import type { ClassName, ServerName } from "@core/types/lostark";

export type Member = {
  memberId: number;
  username: string;
  mainCharacter: MainCharacter;
  role: string;
  adsDate: null | string;
  lifeEnergyResponses: LifeEnergyResponse[];
  lifePotionSmall: number;
  lifePotionMedium: number;
  lifePotionLarge: number;
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

export interface LifeEnergyResponse {
  lifeEnergyId: number;
  energy: number;
  maxEnergy: number;
  characterName: string;
  beatrice: boolean;
  potionLeap: number;
  potionSmall: number;
  potionMedium: number;
  potionLarge: number;
}

export type LifePotionType = "LEAP" | "SMALL" | "MEDIUM" | "LARGE";

export interface UpdateLifePotionRequest {
  lifeEnergyId: number;
  type: LifePotionType;
  num: number;
}

export interface UsePotionRequest {
  lifeEnergyId: number;
  type: LifePotionType;
}

export interface UpdateLifePotionsRequest {
  lifeEnergyId: number;
  potionLeap: number;
  potionSmall: number;
  potionMedium: number;
  potionLarge: number;
}
