import {
  UpdateDailyTodoCategory,
  UpdateWeeklyTodoAction,
} from "@core/types/api";
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

// 레이드 콘텐츠 투두
export interface GetAvaiableRaidsRequest {
  friendUsername?: string;
  characterId: number;
  characterName: string;
}

export interface CheckRaidTodoRequest {
  isFriend: boolean;
  characterId: number;
  characterName: string;
  weekCategory: string;
  currentGate: number;
  totalGate: number;
  checkAll: boolean;
}

export interface UpdateRaidTodoMemoRequest {
  isFriend: boolean;
  characterId: number;
  todoId: number;
  message: string;
}

export interface UpdateRaidTodoSortRequest {
  isFriend: boolean;
  characterId: number;
  characterName: string;
  sorted: TodoRaid[];
}

// 주간 콘텐츠 투두
export interface CheckWeeklyTodoRequest {
  isFriend: boolean;
  characterId: number;
  characterName: string;
  action: UpdateWeeklyTodoAction;
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
