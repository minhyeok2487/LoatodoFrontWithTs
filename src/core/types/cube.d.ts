export interface AddCubeCharacterRequest {
  characterId: number;
  characterName: string;
}

export type CurrentCubeTickets = {
  [key in `ban${1 | 2 | 3 | 4 | 5}` | `unlock${1 | 2 | 3}`]?: number;
};

export interface UpdateCubeCharacterRequest extends CurrentCubeTickets {
  cubeId: number;
  characterId: number;
}

export interface CubeCharacter extends CurrentCubeTickets {
  cubeId: number;
  characterId: number;
  characterName: string;
  itemLevel: number;
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
  lavasBreath: number;
  glaciersBreath: number;
}
