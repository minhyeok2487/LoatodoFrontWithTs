import { useMutation } from "@tanstack/react-query";
import { removeLog, saveEtcLog } from "@core/apis/logs.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { SaveEtcLogRequest } from "@core/types/logs";

export const useRemoveLog = (options?: CommonUseMutationOptions<number>) => {
  return useMutation({ mutationFn: removeLog, ...options });
};

export const useSaveEtcLog = (options?: CommonUseMutationOptions<SaveEtcLogRequest>) => {
  return useMutation({ mutationFn: saveEtcLog, ...options });
};
