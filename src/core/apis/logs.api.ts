import type { GetLogsProfitRequest, LogProfitResponse } from "@core/types/logs";
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