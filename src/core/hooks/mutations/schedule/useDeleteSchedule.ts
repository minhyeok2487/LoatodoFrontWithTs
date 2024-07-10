import { useMutation } from "@tanstack/react-query";

import * as scheduleApi from "@core/apis/schedule.api";
import type { CommonUseMutationOptions } from "@core/types/app";

export default (options?: CommonUseMutationOptions<number>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (scheduleId) => scheduleApi.deleteSchedule(scheduleId),
  });

  return mutation;
};
