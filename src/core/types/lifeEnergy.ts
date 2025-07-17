export type LifeEnergySaveRequest = {
  energy: number;
  maxEnergy: number;
  characterName: string;
  beatrice: boolean;
};

export type LifeEnergyUpdateRequest = {
  id: number;
  energy: number;
  maxEnergy: number;
  characterName: string;
  beatrice: boolean;
};

export type LifeEnergySpendRequest = {
  id: number;
  energy: number;
  gold: number;
  characterName: string;
};