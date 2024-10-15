import { UpdateDailyTodoCategory } from "@core/types/api";
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

// 일간 콘텐츠 투두
export interface UpdateRestGaugeRequest {
  isFriend: boolean;
  characterId: number;
  characterName: string;
  chaosGauge: number;
  eponaGauge: number;
  guardianGauge: number;
}

export interface CheckDailyTodoRequest {
  isFriend: boolean;
  characterId: number;
  characterName: string;
  category: UpdateDailyTodoCategory;
  checkAll: boolean;
}

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
  characterName: string;
}

export interface ToggleGoldRaidRequest {
  friendUsername?: string;
  characterId: number;
  characterName: string;
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

// 주간 콘텐츠 투두
export interface UpdateCubeTicketRequest {
  friendUsername?: string;
  characterId: number;
  num: number;
}

export interface CheckWeeklyEponaRequest {
  friendUsername?: string;
  characterId: number;
  all: boolean;
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
