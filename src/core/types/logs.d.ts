export interface LogProfitResponse {
    localDate: string,
    dayProfit: number,
    weekProfit: number,
    totalProfit: number
}

export interface GetLogsProfitRequest {
    characterId?: number;
    startDate: string;
    endDate: string;
}