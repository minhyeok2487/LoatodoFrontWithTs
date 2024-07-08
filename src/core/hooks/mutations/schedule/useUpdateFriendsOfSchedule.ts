import { useMutation } from "@tanstack/react-query";

import * as scheduleApi from "@core/apis/schedule.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateFriendsOfScheduleRequest } from "@core/types/schedule";

export default (
  options?: CommonUseMutationOptions<UpdateFriendsOfScheduleRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => scheduleApi.updateFriendsOfSchedule(params),
  });

  return mutation;
};
