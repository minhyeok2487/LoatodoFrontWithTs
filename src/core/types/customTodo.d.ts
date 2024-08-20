export type CustomTodoFrequency = "DAILY" | "WEEKLY";

export interface CustomTodoItem {
  id: number;
  characterId: number;
  contentName: string;
  frequency: CustomTodoFrequency;
  checked: boolean;
}

export interface AddCustomTodoRequest {
  characterId: number;
  contentName: string;
  frequency: CustomTodoFrequency;
}

export interface CheckCustomTodoRequest {
  characterId: number;
  customTodoId: number;
}
