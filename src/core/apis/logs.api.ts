import type { GetLogsProfitRequest, GetLogsRequest, LogProfitResponse, Logs, SaveEtcLogRequest } from "@core/types/logs";
import type { NoDataResponse } from "@core/types/api";
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

export const removeLog = (logId: number): Promise<NoDataResponse> => {
    return mainAxios.delete(`/api/v1/logs/${logId}`);
};

export const saveEtcLog = (request: SaveEtcLogRequest): Promise<NoDataResponse> => {
    return mainAxios.post("/api/v1/logs", request);
};