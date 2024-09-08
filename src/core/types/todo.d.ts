import {
  UpdateDailyTodoCategory,
  UpdateWeeklyTodoAction,
} from "@core/types/api";
import type { SortCharacterItem } from "@core/types/app";

export type CustomTodoFrequency = "DAILY" | "WEEKLY";

export interface UpdateCharacterSortRequest {
  friendUsername?: string;
  sortCharacters: SortCharacterItem[];
}

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

export interface CheckRaidTodoRequest {
  isFriend: boolean;
  characterId: number;
  characterName: string;
  weekCategory: string;
  currentGate: number;
  totalGate: number;
  checkAll: boolean;
}

export interface CheckWeeklyTodoRequest {
  isFriend: boolean;
  characterId: number;
  characterName: string;
  action: UpdateWeeklyTodoAction;
}

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
