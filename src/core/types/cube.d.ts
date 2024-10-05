export interface AddCubeCharacterRequest {
  characterId: number;
  characterName: string;
}

export interface UpdateCubeCharacterRequest {
  cubeId: number;
  characterId: number;
  ban1: number;
  ban2: number;
  ban3: number;
  ban4: number;
  ban5: number;
  unlock1: number;
  unlock2: number;
}

export interface CubeCharacter {
  cubeId: number;
  characterId: number;
  characterName: string;
  itemLevel: number;
  // 금제
  ban1: number;
  ban2: number;
  ban3: number;
  ban4: number;
  ban5: number;
  // 해금
  unlock1: number;
  unlock2: number;
}

export interface CubeReward {
  name: string;
  jewelry: number;
  leapStone: number;
  shilling: number;
  solarGrace: number;
  solarBlessing: number;
  solarProtection: number;
  cardExp: number;
  jewelryPrice: number;
}
