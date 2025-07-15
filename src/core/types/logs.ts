export interface Log {
  logsId: number;
  characterId: number;
  characterName: string;
  characterClassName: string;
  logContent: string;
  message: string;
  profit: number;
  localDate: string;
  createdDate: string;
}

export interface Logs {
  content: Log[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: any;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface GetLogsRequest {
  logsId?: number;
  characterId?: number;
  logContent?: string;
}

export interface GetLogsProfitRequest {
  characterId?: number;
  startDate: string;
  endDate: string;
}

export interface LogProfitResponse {
  localDate: string;
  totalProfit: number;
}

export interface SaveEtcLogRequest {
  characterId: number;
  localDate: string;
  message: string;
  profit: number;
}
