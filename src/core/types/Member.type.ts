export type MemberType = {
  memberId: number;
  username: string;
  mainCharacter: MainCharacterType;
  role: string;
};

export type MainCharacterType = {
  serverName: string;
  characterName: string;
  characterImage: string;
  characterClassName: string;
  itemLevel: number;
};

export type EditMainCharacterType = {
  mainCharacter: string;
};
