import { useMutation } from "@tanstack/react-query";

import * as scheduleApi from "@core/apis/schedule.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { CreateScheduleRequest } from "@core/types/schedule";

export default (options?: CommonUseMutationOptions<CreateScheduleRequest>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => scheduleApi.createSchedule(params),
  });

  return mutation;
};
