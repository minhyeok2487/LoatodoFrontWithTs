import type { UpdateDailyTodoCategory } from "@core/types/api";
import type { SortCharacterItem } from "@core/types/app";
import type { ServerName } from "@core/types/lostark";
import type { Weekday } from "@core/types/schedule";

export type CustomTodoFrequency = "DAILY" | "WEEKLY";

export type DailyTodoType = "chaos" | "guardian" | "custom";

export interface DailyTodoItem {
  id: DailyTodoType;
  name: string;
}

export interface ServerTodoItem {
  todoId: number;
  contentName: string;
  defaultEnabled: boolean;
  visibleWeekdays: Weekday[];
  frequency?: CustomTodoFrequency;
  custom?: boolean;
}

export interface ServerTodoState {
  todoId: number;
  serverName: ServerName;
  enabled: boolean;
  checked: boolean;
}

export interface ServerTodoOverviewResponse {
  todos: ServerTodoItem[];
  states: ServerTodoState[];
}

export interface UpdateCharacterMemoRequest {
  friendUsername?: string;
  characterId: number;
  memo: string;
}

export interface UpdateCharacterSortRequest {
  friendUsername?: string;
  sortCharacters: SortCharacterItem[];
}

// 일간 투두
export interface CheckDailyTodoRequest {
  friendUsername?: string;
  characterId: number;
  category: UpdateDailyTodoCategory;
  allCheck: boolean;
}

// 일간 전체 투두
export interface CheckDailyTodoAllRequest {
  friendUsername?: string;
  characterId: number;
}

export interface UpdateRestGaugeRequest {
  friendUsername?: string;
  characterId: number;
  chaosGauge: number;
  guardianGauge: number;
}

// 레이드 투두
export interface GetAvaiableRaidsRequest {
  friendUsername?: string;
  characterId: number;
}

export interface UpdateRaidTodoRequest {
  friendUsername?: string;
  characterId: number;
  weekContentIdList: number[];
}

export interface ToggleGoldCharacterRequest {
  friendUsername?: string;
  characterId: number;
}

export interface ToggleGoldVersionRequest {
  friendUsername?: string;
  characterId: number;
}

export interface ToggleGoldRaidRequest {
  friendUsername?: string;
  characterId: number;
  weekCategory: string;
  updateValue: boolean;
}

export interface CheckRaidTodoRequest {
  friendUsername?: string;
  characterId: number;
  weekCategory: string;
  allCheck: boolean;
}

export interface UpdateRaidTodoMemoRequest {
  friendUsername?: string;
  characterId: number;
  todoId: number;
  message: string;
}

export interface UpdateRaidTodoSortRequest {
  friendUsername?: string;
  characterId: number;
  sorted: TodoRaid[];
}

// 주간 투두
export interface UpdateCubeTicketRequest {
  friendUsername?: string;
  characterId: number;
  num: number;
}

export interface UpdateHellKeyRequest {
  friendUsername?: string;
  characterId: number;
  num: number;
}

export interface UpdateTrialSandRequest {
  friendUsername?: string;
  characterId: number;
  num: number;
}

export interface CheckSilmaelExchangeRequest {
  friendUsername?: string;
  characterId: number;
}

export interface CheckElysianRequest {
  friendUsername?: string;
  characterId: number;
  action: "INCREMENT" | "DECREMENT";
}

export interface CheckAllElysianRequest {
  friendUsername?: string;
  characterId: number;
}


// 커스텀 투두
export interface CustomTodoItem {
  customTodoId: number;
  characterId: number;
  contentName: string;
  frequency: CustomTodoFrequency;
  checked: boolean;
}

export interface AddCustomTodoRequest {
  friendUsername?: string;
  characterId: number;
  contentName: string;
  frequency: CustomTodoFrequency;
}

export interface UpdateCustomTodoRequest {
  friendUsername?: string;
  customTodoId: number;
  characterId: number;
  contentName: string;
}

export interface CheckCustomTodoRequest {
  friendUsername?: string;
  characterId: number;
  customTodoId: number;
}

export interface RemoveCustomTodoRequest {
  friendUsername?: string;
  customTodoId: number;
}

export interface ToggleServerTodoEnabledRequest {
  friendUsername?: string;
  todoId: number;
  serverName: ServerName;
  enabled: boolean;
}

export interface CheckServerTodoRequest {
  friendUsername?: string;
  todoId: number;
  serverName: ServerName;
  checked: boolean;
}

export interface CreateServerTodoRequest {
  contentName: string;
  defaultEnabled: boolean;
  frequency: CustomTodoFrequency;
  custom: boolean;
}

export interface DeleteServerTodoRequest {
  todoId: number;
}

// 레이드 버스비 업데이트
export interface UpdateRaidBusGoldRequest {
  friendUsername?: string;
  characterId: number;
  weekCategory: string;
  busGold: number;
  fixed: boolean;
}

// 레이드 관문 더보기 업데이트
export interface UpdateRaidMoreRewardCheckRequest {
  friendUsername?: string;
  characterId: number;
  weekCategory: string;
  gate: number;
}

// 모든 캐릭터 일일 숙제 전체 체크(출력된 것만)
export interface UpdateDayTodoAllCharactersRequest {
  serverName: string;
  friendUsername?: string;
}

export interface UpdateDayTodoAllCharactersResponse {
  serverName: string;
  done: boolean;
}
