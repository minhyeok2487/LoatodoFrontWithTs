export interface GetWeeklyRaidsRequest {
  characterId: number;
  characterName: string;
}

export interface UpdateVisibleSettingRequest {
  characterId: number;
  characterName: string;
  value: boolean;
  name: VisibleSettingName;
}

export interface Character {
  characterId: number;
  characterClassName: string;
  characterImage: string;
  characterName: string;
  itemLevel: number;
  serverName: string;
  sortNumber: number;
  chaos: DailyContent;
  chaosCheck: number;
  chaosGauge: number;
  chaosGold: number;
  guardian: DailyContent;
  guardianCheck: number;
  guardianGauge: number;
  guardianGold: number;
  eponaCheck: number;
  eponaGauge: number;
  goldCharacter: boolean;
  challengeGuardian: boolean;
  challengeAbyss: boolean;
  settings: Settings;
  weekGold: number;
  weekEpona: number;
  silmaelChange: boolean;
  cubeTicket: number;
  weekDayTodoGold: number;
  weekRaidGold: number;
  todoList: Todo[];
}

export interface Todo {
  id: number;
  name: string;
  characterClassName: string;
  gold: number;
  check: boolean;
  message: string;
  currentGate: number;
  totalGate: number;
  weekCategory: string;
  weekContentCategory: string;
  sortNumber: number;
  goldCheck: boolean;
}

export interface DailyContent {
  id: number;
  category: string;
  characterClassName: string;
  name: string;
  level: number;
  shilling: number;
  honorShard: number;
  leapStone: number;
  destructionStone: number;
  guardianStone: number;
  jewelry: number;
}

export interface WeeklyRaid {
  id: number;
  weekCategory: string;
  weekContentCategory: string;
  name: string;
  level: number;
  gate: number;
  gold: number;
  checked: boolean;
  coolTime: number;
  goldCheck: boolean;
}

export interface Settings {
  goldCheckVersion: boolean;
  goldCheckPolicyEnum: string;
  showCharacter: boolean;
  showEpona: boolean;
  showChaos: boolean;
  showGuardian: boolean;
  showWeekTodo: boolean;
  showWeekEpona: boolean;
  showSilmaelChange: boolean;
  showCubeTicket: boolean;
}

export type CubeName = "1금제" | "2금제" | "3금제" | "4금제" | "5금제";

export interface CubeReward {
  name: CubeName;
  jewelry: number;
  leapStone: number;
  shilling: number;
  solarGrace: number;
  solarBlessing: number;
  solarProtection: number;
  cardExp: number;
  jewelryPrice: number;
}

export type VisibleSettingName = keyof Omit<
  Settings,
  "goldCheckVersion" | "goldCheckPolicyEnum"
>;
