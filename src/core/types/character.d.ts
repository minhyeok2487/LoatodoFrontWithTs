import {
  UpdateCharacterRequest,
  UpdateDailyTodoCategory,
} from "@core/types/api";
import { Challenge, ClassName, ServerName } from "@core/types/lostark";

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

export interface SaveCharactersSortRequest {
  sortCharacters: SortCharacterItem[];
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

export interface UpdateWeeklyRaidMemoRequest {
  characterId: number;
  todoId: number;
  message: string;
}

export interface UpdateDailyTodoRequest extends UpdateCharacterRequest {
  category: UpdateDailyTodoCategory;
}

export interface UpdateRestGaugeRequest extends UpdateCharacterRequest {
  chaosGauge: number;
  eponaGauge: number;
  guardianGauge: number;
}

export type UpdateWeeklyRaidTodoRequest = UpdateCharacterRequest & {
  weekCategory: string;
} & (
    | {
        allCheck: false;
        currentGate: number;
        totalGatte: number;
      }
    | {
        allCheck: true;
      }
  );

export type UpdateWeeklyTodoRequest = UpdateCharacterRequest<"id">;

export interface Character {
  characterId: number;
  characterClassName: ClassName;
  characterImage: string;
  characterName: string;
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
  weekContentCategory: string;
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
  goldCheckVersion: boolean; // true: 체크방식, false: 상위 3개
  goldCheckPolicyEnum: "RAID_CHECK_POLICY" | "TOP_THREE_POLICY";
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
