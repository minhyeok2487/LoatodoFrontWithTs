import { useMutation } from "@tanstack/react-query";

import * as scheduleApi from "@core/apis/schedule.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateScheduleRequest } from "@core/types/schedule";

export default (options?: CommonUseMutationOptions<UpdateScheduleRequest>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => scheduleApi.updateSchedule(params),
  });

  return mutation;
};
