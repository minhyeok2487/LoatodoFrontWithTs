import type { LOG_CONTENT } from "@core/constants";

export type LogContent = keyof typeof LOG_CONTENT

export interface LogProfitResponse {
    localDate: string,
    dayProfit: number,
    weekProfit: number,
    totalProfit: number
}

export interface Logs {
    content: LogResponse[];
    hasNext: boolean;
}

export interface LogResponse {
    logsId: number,
    createdDate: string,
    localDate: string,
    logType: string,
    logContent: LogContent,
    name: string,
    message: string,
    profit: number
}

export interface GetLogsProfitRequest {
    characterId?: number;
    startDate: string;
    endDate: string;
}

export interface GetLogsRequest {
    logsId?: number;
    characterId?: number;
    logContent?: LogContent,
}