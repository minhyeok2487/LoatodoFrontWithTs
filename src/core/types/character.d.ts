import { UpdateCharacterRequest } from "@core/types/api";
import {
  Challenge,
  ClassName,
  ServerName,
  WeekContentCategory,
} from "@core/types/lostark";

export interface GetAvailableWeeklyRaidsRequest {
  characterId: number;
  characterName: string;
}

export interface UpdateVisibleSettingRequest {
  characterId: number;
  characterName: string;
  value: boolean;
  name: VisibleSettingName;
}

export interface UpdateChallengeRequest {
  serverName: ServerName;
  content: Challenge;
}

export type ToggleOptainableGoldCharacterRequest = UpdateCharacterRequest;

export type ToggleCharacterGoldCheckVersionRequest = UpdateCharacterRequest;

export interface ToggleOptainableGoldRaidRequest
  extends UpdateCharacterRequest {
  weekCategory: string;
  updateValue: boolean;
}

export interface UpdateTodoRaidListRequest extends UpdateCharacterRequest {
  raids: WeeklyRaid[];
}

export interface UpdateTodoRaidRequest extends UpdateCharacterRequest {
  raid: WeeklyRaid;
}

export interface SaveWeeklyRaidTodoListSortRequest
  extends UpdateCharacterRequest {
  sorted: TodoRaid[];
}

export interface Character {
  characterId: number;
  characterClassName: ClassName;
  characterImage: string;
  characterName: string;
  memo: string | null;
  itemLevel: number;
  serverName: ServerName;
  sortNumber: number;
  chaos: DailyContentInformation;
  chaosCheck: number;
  chaosGauge: number;
  chaosGold: number;
  guardian: DailyContentInformation;
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
  todoList: TodoRaid[];
}

export interface TodoRaid {
  id: number;
  name: string;
  characterClassName: ClassName;
  gold: number;
  check: boolean;
  message: string | null;
  currentGate: number;
  totalGate: number;
  weekCategory: string;
  weekContentCategory: WeekContentCategory;
  sortNumber: number;
  goldCheck: boolean;
}

export interface DailyContentInformation {
  id: number;
  category: string;
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
  weekContentCategory: WeekContentCategory;
  name: string;
  level: number;
  gate: number;
  gold: number;
  checked: boolean;
  coolTime: number;
  goldCheck: boolean;
}

export interface Settings {
  goldCheckVersion: boolean; // true: 체크방식, false: 상위 3개
  goldCheckPolicyEnum: "RAID_CHECK_POLICY" | "TOP_THREE_POLICY";
  showCharacter: boolean; // 캐릭터 출력
  showEpona: boolean; // 일일 숙제 - 에포나 출력
  showChaos: boolean; // 일일 숙제 - 카오스 던전 출력
  showGuardian: boolean; // 일일 숙제 - 가디언 토벌 출력
  showWeekTodo: boolean; // 주간 레이드 출력
  showWeekEpona: boolean; // 주간 숙제 - 주간 에포나 출력
  showSilmaelChange: boolean; // 주간 숙제 - 실마엘 혈석 교환 출력
  showCubeTicket: boolean; // 주간 숙제 - 큐브 티켓 출력
}

export type CubeName =
  | "1금제"
  | "2금제"
  | "3금제"
  | "4금제"
  | "5금제"
  | "1해금";

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
