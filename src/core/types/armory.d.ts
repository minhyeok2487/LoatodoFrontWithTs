// Lostark /armories/characters/{name} 응답 구조

export interface ArmoryResponse {
  ArmoryProfile: ArmoryProfile | null;
  ArmoryEquipment: ArmoryEquipment[] | null;
  ArmoryAvatars: ArmoryAvatar[] | null;
  ArmorySkills: ArmorySkill[] | null;
  ArmoryEngraving: ArmoryEngraving | null;
  ArmoryCard: ArmoryCard | null;
  ArmoryGem: ArmoryGem | null;
  ArkPassive: ArmoryArkPassive | null;
  ArkGrid: unknown | null;
  Collectibles: Collectible[] | null;
  ColosseumInfo: unknown | null;
}

// ─── 프로필 ───
export interface ArmoryProfile {
  CharacterImage: string | null;
  ExpeditionLevel: number;
  PvpGradeName: string | null;
  TownLevel: number | null;
  TownName: string | null;
  Title: string | null;
  GuildMemberGrade: string | null;
  GuildName: string | null;
  UsingSkillPoint: number;
  TotalSkillPoint: number;
  Stats: ProfileStat[];
  Tendencies: ProfileTendency[];
  ServerName: string;
  CharacterName: string;
  CharacterLevel: number;
  CharacterClassName: string;
  ItemAvgLevel: string;
  ItemMaxLevel: string;
  CombatPower: string | null;
}

export interface ProfileStat {
  Type: string;
  Value: string;
  Tooltip: string[];
}

export interface ProfileTendency {
  Type: string;
  Point: number;
  MaxPoint: number;
}

// ─── 장비 ───
export interface ArmoryEquipment {
  Type: string;
  Name: string;
  Icon: string;
  Grade: string;
  Tooltip: string; // JSON 문자열
}

// ─── 아바타 ───
export interface ArmoryAvatar {
  Type: string;
  Name: string;
  Icon: string;
  Grade: string;
  IsSet: boolean;
  IsInner: boolean;
  Tooltip: string; // JSON 문자열
}

// ─── 스킬 ───
export interface ArmorySkill {
  Name: string;
  Icon: string;
  Level: number;
  Type: string;
  IsAwakening: boolean;
  Tripods: SkillTripod[];
  Rune: SkillRune | null;
  Tooltip: string; // JSON 문자열
  GemOption?: SkillGemOption[] | null;
}

export interface SkillTripod {
  Tier: number;
  Slot: number;
  Name: string;
  Icon: string;
  Level: number;
  IsSelected: boolean;
  Tooltip: string; // JSON 문자열
}

export interface SkillRune {
  Name: string;
  Icon: string;
  Grade: string;
  Tooltip: string;
}

export interface SkillGemOption {
  Description: string;
  GemSlot: number;
}

// ─── 각인 ───
export interface ArmoryEngraving {
  Engravings: EngravingItem[] | null;
  Effects: EngravingEffect[] | null;
  ArkPassiveEffects: ArkPassiveEngravingEffect[] | null;
}

export interface EngravingItem {
  Slot: number;
  Name: string;
  Icon: string;
  Tooltip: string;
}

export interface EngravingEffect {
  Name: string;
  Description: string;
}

export interface ArkPassiveEngravingEffect {
  AbilityStoneLevel: number | null;
  Description: string;
  Grade: string;
  Level: number;
  Name: string;
}

// ─── 보석 ───
export interface ArmoryGem {
  Gems: GemItem[];
  Effects: GemEffects;
}

export interface GemItem {
  Slot: number;
  Name: string;
  Icon: string;
  Level: number;
  Grade: string;
  Tooltip: string;
}

export interface GemEffects {
  Description: string | null;
  Skills: GemSkillEffect[];
}

export interface GemSkillEffect {
  GemSlot: number;
  Name: string;
  Description: string[];
  Icon: string;
  Option: string | null;
}

// ─── 카드 ───
export interface ArmoryCard {
  Cards: CardItem[];
  Effects: CardEffect[];
}

export interface CardItem {
  Slot: number;
  Name: string;
  Icon: string;
  AwakeCount: number;
  AwakeTotal: number;
  Grade: string;
  Tooltip: string;
}

export interface CardEffect {
  Index: number;
  CardSlots: number[];
  Items: CardEffectItem[];
}

export interface CardEffectItem {
  Name: string;
  Description: string;
}

// ─── 아크패시브 ───
export interface ArmoryArkPassive {
  Title: string | null;
  IsArkPassive: boolean;
  Points: ArkPassivePoint[];
  Effects: ArkPassiveEffect[];
}

export interface ArkPassivePoint {
  Name: string;
  Value: number;
  Tooltip: string;
  Description: string | null;
}

export interface ArkPassiveEffect {
  Name: string;
  Description: string | null;
  Icon: string | null;
  ToolTip: string | null;
}

// ─── 수집형 포인트 ───
export interface Collectible {
  Type: string;
  Icon: string;
  Point: number;
  MaxPoint: number;
  CollectiblePoints: CollectiblePoint[];
}

export interface CollectiblePoint {
  PointName: string;
  Point: number;
  MaxPoint: number;
}

// ─── 원정대 (siblings) ───
export interface SiblingCharacter {
  ServerName: string;
  CharacterName: string;
  CharacterLevel: number;
  CharacterClassName: string;
  ItemAvgLevel: string;
  ItemMaxLevel: string;
}
