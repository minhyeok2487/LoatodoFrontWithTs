export type CharacterType = {
  characterId: number;
  characterClassName: string;
  characterImage: string;
  characterName: string;
  itemLevel: number;
  serverName: string;
  sortNumber: number;
  chaos: DayContentType;
  chaosCheck: number;
  chaosGauge: number;
  chaosGold: number;
  guardian: DayContentType;
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
  todoList: TodoType[];
};

export type TodoType = {
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
};

export type DayContentType = {
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
};

export type WeekContnetType = {
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
};

export type Settings = {
  showCharacter: boolean;
  showEpona: boolean;
  showChaos: boolean;
  showGuardian: boolean;
  showWeekTodo: boolean;
  showWeekEpona: boolean;
  showSilmaelChange: boolean;
  showCubeTicket: boolean;
  goldCheckVersion: boolean;
  goldCheckPolicyEnum: string;
};

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
