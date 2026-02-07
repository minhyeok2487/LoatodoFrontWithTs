export interface InspectionCharacter {
  id: number;
  characterName: string;
  serverName: string;
  characterClassName: string;
  characterImage: string;
  itemLevel: number;
  combatPower: number;
  noChangeThreshold: number;
  isActive: boolean;
  createdDate: string;
  previousCombatPower: number | null;
  combatPowerChange: number;
  previousItemLevel: number | null;
  itemLevelChange: number | null;
  unchangedDays: number;
}

export interface ArkgridEffect {
  effectName: string;
  effectLevel: number;
  effectTooltip: string;
}

export interface CombatPowerHistory {
  id: number;
  recordDate: string;
  combatPower: number;
  itemLevel: number;
  arkgridEffects: ArkgridEffect[];
}

export interface InspectionDashboard {
  character: InspectionCharacter;
  histories: CombatPowerHistory[];
}

export interface CreateInspectionCharacterRequest {
  characterName: string;
  noChangeThreshold?: number;
}

export interface UpdateInspectionCharacterRequest {
  noChangeThreshold?: number;
  isActive?: boolean;
}

export interface UpdateInspectionScheduleRequest {
  scheduleHour: number;
}

export interface InspectionScheduleResponse {
  scheduleHour: number;
}
