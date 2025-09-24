import { useQuery } from "@tanstack/react-query";

import * as analysisApi from "@core/apis/analysis.api";
import { STALE_TIME_MS } from "@core/constants";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { AnalysisSearchResponse } from "@core/types/analysis";
import type { CursorResponse } from "@core/types/api";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (options?: CommonUseQueryOptions<CursorResponse<AnalysisSearchResponse>>) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getAnalysisList(),
    queryFn: () => analysisApi.getAnalysisList(),
    staleTime: STALE_TIME_MS,
  });

  return query;
};
