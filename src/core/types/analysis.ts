export interface Analysis {
  characterId: number;
  characterName: string;
  className: string;
  itemLevel: number;
  combatPower: number;
  contentName: string;
  contentDate: string; // Added contentDate
  battleTime: number;
  damage: number;
  dps: number;
  customData: Record<string, number>;
}

export interface AnalysisSearchResponse {
  id: number;
  characterName: string;
  characterClassName: string;
  itemLevel: number;
  combatPower: number;
  contentName: string;
  contentDate: string; // Added contentDate
  battleTime: number;
  damage: number;
  dps: number;
  analysisDetails: Record<string, number>;
}
