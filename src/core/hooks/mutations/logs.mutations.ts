import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { removeLog, saveEtcLog } from "@core/apis/logs.api";
import type { SaveEtcLogRequest } from "@core/types/logs";

export const useRemoveLog = (options?: Omit<UseMutationOptions<void, unknown, number>, "mutationFn">) => {
  return useMutation<void, unknown, number>({ mutationFn: removeLog, ...options });
};

export const useSaveEtcLog = (options?: Omit<UseMutationOptions<void, unknown, SaveEtcLogRequest>, "mutationFn">) => {
  return useMutation<void, unknown, SaveEtcLogRequest>({ mutationFn: saveEtcLog, ...options });
};
