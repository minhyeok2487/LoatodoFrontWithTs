import { useQuery } from "@tanstack/react-query";

import * as logsApi from "@core/apis/logs.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";
import type { GetLogsProfitRequest, LogProfitResponse } from "@core/types/logs";

export default (
  params: GetLogsProfitRequest,
  options?: CommonUseQueryOptions<LogProfitResponse[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getLogsProfit(params),
    queryFn: () => logsApi.getLogsProfit(params),
  });

  return query;
};
