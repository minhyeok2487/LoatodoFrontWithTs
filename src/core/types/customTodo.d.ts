export type CustomTodoFrequency = "DAILY" | "WEEKLY";

export interface CustomTodoItem {
  customTodoId: number;
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

export interface UpdateCustomTodoRequest {
  customTodoId: number;
  characterId: number;
  contentName: string;
}

export interface CheckCustomTodoRequest {
  characterId: number;
  customTodoId: number;
}
