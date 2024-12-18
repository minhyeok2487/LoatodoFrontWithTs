import type { UpdateDailyTodoCategory } from "@core/types/api";
import type { SortCharacterItem } from "@core/types/app";

export type CustomTodoFrequency = "DAILY" | "WEEKLY";

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

export interface UpdateRestGaugeRequest {
  friendUsername?: string;
  characterId: number;
  chaosGauge: number;
  eponaGauge: number;
  guardianGauge: number;
}

// 레이드 투두
export interface GetAvaiableRaidsRequest {
  friendUsername?: string;
  characterId: number;
  characterName: string;
}

export interface UpdateRaidTodoRequest {
  friendUsername?: string;
  characterId: number;
  weekContentIdList: number[];
}

export interface ToggleGoldCharacterRequest {
  friendUsername?: string;
  characterId: number;
  characterName: string;
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

export interface CheckWeeklyEponaRequest {
  friendUsername?: string;
  characterId: number;
  allCheck: boolean;
}

export interface CheckSilmaelExchangeRequest {
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
