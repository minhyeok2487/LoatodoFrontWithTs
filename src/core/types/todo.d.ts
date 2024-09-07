import {
  UpdateDailyTodoCategory,
  UpdateWeeklyTodoAction,
} from "@core/types/api";

export type CustomTodoFrequency = "DAILY" | "WEEKLY";

export interface CheckDailyTodoRequest {
  characterId: number;
  characterName: string;
  category: UpdateDailyTodoCategory;
  checkAll: boolean;
  isFriend: boolean;
}

export type CheckRaidTodoRequest = {
  characterId: number;
  characterName: string;
  weekCategory: string;
  currentGate: number;
  totalGate: number;
  isFriend: boolean;
  checkAll: boolean;
};

export interface CheckWeeklyTodoRequest {
  characterId: number;
  characterName: string;
  action: UpdateWeeklyTodoAction;
  isFriend: boolean;
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
