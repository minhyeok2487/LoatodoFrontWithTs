import { ServerName } from "./lostark";

export type Member = {
  memberId: number;
  username: string;
  mainCharacter: MainCharacter;
  role: string;
};

export type MainCharacter = {
  serverName: ServerName | null;
  characterName: string | null;
  characterImage: string | null;
  characterClassName: string | null;
  itemLevel: number;
};

export type UpdateMainCharacterRequest = {
  mainCharacter: string;
};

export interface UpdateApiKeyRequest {
  apiKey: string;
}
