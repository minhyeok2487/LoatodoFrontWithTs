import { useMutation } from "@tanstack/react-query";
import { removeLog, saveEtcLog } from "@core/apis/logs.api";
import type { SaveEtcLogRequest } from "@core/types/logs";

export const useRemoveLog = (options?: any) => {
  return useMutation<void, unknown, number>({ mutationFn: removeLog, ...options });
};

export const useSaveEtcLog = (options?: any) => {
  return useMutation<void, unknown, SaveEtcLogRequest>({ mutationFn: saveEtcLog, ...options });
};
