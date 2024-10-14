export interface MessageResponse {
  message: string;
  success: boolean;
}

export interface NoDataResponse {
  data: unknown;
  status: number;
}

export interface CustomError {
  errorCode: number;
  errorMessage: string;
  exceptionName: string;
}

export type UpdateDailyTodoCategory = "epona" | "chaos" | "guardian";

export type UpdateWeeklyTodoAction =
  | "UPDATE_WEEKLY_EPONA"
  | "UPDATE_WEEKLY_EPONA_ALL"
  | "TOGGLE_SILMAEL_EXCHANGE"
  | "SUBSCTRACT_CUBE_TICKET"
  | "ADD_CUBE_TICKET";
