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
  title: string | null;
  guildName: string | null;
  townName: string | null;
  townLevel: number | null;
  expeditionLevel: number;
  stats: { type: string; value: string }[];
}

export interface ArkgridEffect {
  effectName: string;
  effectLevel: number;
  effectTooltip: string;
}

export interface EquipmentHistory {
  type: string;
  name: string;
  icon: string;
  grade: string;
  itemLevel: number | null;
  quality: number | null;
  refinement: number | null;
  advancedRefinement: number | null;
  basicEffect: string | null;
  additionalEffect: string | null;
  arkPassiveEffect: string | null;
  grindingEffect: string | null;
  braceletEffect: string | null;
  engravings: string | null;
}

export interface Engraving {
  name: string;
  level: number;
  grade: string;
  abilityStoneLevel: number | null;
}

export interface Card {
  slot: number;
  name: string;
  icon: string;
  awakeCount: number;
  awakeTotal: number;
  grade: string;
}

export interface CardSetEffect {
  name: string;
  description: string;
}

export interface Gem {
  skillName: string;
  gemSlot: number;
  skillIcon: string;
  level: number;
  grade: string;
  description: string;
  gemOption: string;
}

export interface ArkPassivePoint {
  name: string;
  value: number;
  description: string;
}

export interface ArkPassiveEffect {
  category: string;
  effectName: string;
  icon: string;
  tier: number;
  level: number;
}

export interface CombatPowerHistory {
  id: number;
  recordDate: string;
  combatPower: number;
  itemLevel: number;
  arkgridEffects: ArkgridEffect[];
  equipments: EquipmentHistory[];
  engravings: Engraving[];
  cards: Card[];
  cardSetEffects: CardSetEffect[];
  gems: Gem[];
  arkPassivePoints: ArkPassivePoint[];
  arkPassiveEffects: ArkPassiveEffect[];
  arkPassiveTitle: string;
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
