import { useMutation } from "@tanstack/react-query";

import * as logsApi from "@core/apis/logs.api";
import type { CommonUseMutationOptions } from "@core/types/app";

export const useRemoveLog = (
    options?: CommonUseMutationOptions<number>
) => {
    const mutation = useMutation({
        ...options,
        mutationFn: (logId) => logsApi.remove(logId),
    });

    return mutation;
};