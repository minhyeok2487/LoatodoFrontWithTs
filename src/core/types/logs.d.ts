export interface LogProfitResponse {
    localDate: string,
    dayProfit: number,
    weekProfit: number,
    totalProfit: number
}

export interface LogResponse {
    logsId: number,
    createdDate: string,
    localDate: string,
    logType: string,
    logContent: string,
    name: string,
    message: string,
    profit: number
}

export interface GetLogsProfitRequest {
    characterId?: number;
    startDate: string;
    endDate: string;
}