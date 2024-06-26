export interface MessageResponse {
  message: string;
  success: boolean;
}

export type OkResponse = string;

export interface CustomError {
  errorCode: number;
  errorMessage: string;
  exceptionName: string;
}
