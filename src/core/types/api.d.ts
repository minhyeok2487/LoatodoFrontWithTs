export interface MessageResponse {
  message: string;
  success: boolean;
}

export type OkResponse = string;

export interface NoDataResponse {
  data: unknown;
  status: number;
}

export interface CustomError {
  errorCode: number;
  errorMessage: string;
  exceptionName: string;
}
