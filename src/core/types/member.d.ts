export type Member = {
  memberId: number;
  username: string;
  mainCharacter: MainCharacter;
  role: string;
};

export type MainCharacter = {
  serverName: string;
  characterName: string;
  characterImage: string;
  characterClassName: string;
  itemLevel: number;
};

export type UpdateMainCharacterRequest = {
  mainCharacter: string;
};

export interface UpdateApiKeyRequest {
  apiKey: string;
  characterName: string;
}
