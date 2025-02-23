import type { GetLogsProfitRequest, GetLogsRequest, LogProfitResponse, Logs } from "@core/types/logs";
import mainAxios from "./mainAxios";

export const getLogsProfit = (params: GetLogsProfitRequest): Promise<LogProfitResponse[]> => {
    return mainAxios.get("/api/v1/logs/profit", {
        params: {
            characterId: params.characterId,
            startDate: params.startDate,
            endDate: params.endDate
        },
    }).then((res) => res.data);
};

export const getLogs = (params: GetLogsRequest): Promise<Logs> => {
    return mainAxios.get("/api/v1/logs", {
        params: {
            logsId: params.logsId,
            characterId: params.characterId,
            logContent: params.logContent
        },
    }).then((res) => res.data);
};