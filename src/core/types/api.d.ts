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

export type UpdateDailyTodoCategory = "chaos" | "guardian";

export interface CursorResponse<T> {
  content: T[];
  hasNext: boolean;
}