import type { NoDataResponse, CursorResponse } from "@core/types/api";
import type { Analysis, AnalysisSearchResponse } from "@core/types/analysis";

import mainAxios from "./mainAxios";

export const createAnalysis = (
  analysis: Analysis
): Promise<NoDataResponse> => {
  return mainAxios.post("/api/v1/analysis", analysis);
};

export const getAnalysisList = (): Promise<CursorResponse<AnalysisSearchResponse>> => {
  return mainAxios.get("/api/v1/analysis").then((res) => res.data);
};