import { useMutation } from "@tanstack/react-query";
import { removeLog, saveEtcLog } from "@core/apis/logs.api";
import type { NoDataResponse } from "@core/types/api";
import type { SaveEtcLogRequest } from "@core/types/logs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useRemoveLog = (options?: any) => {
  return useMutation<NoDataResponse, unknown, number>({ mutationFn: removeLog, ...options });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useSaveEtcLog = (options?: any) => {
  return useMutation<NoDataResponse, unknown, SaveEtcLogRequest>({ mutationFn: saveEtcLog, ...options });
};
