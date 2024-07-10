import { useQuery } from "@tanstack/react-query";

import * as scheduleApi from "@core/apis/schedule.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { ScheduleDetail } from "@core/types/schedule";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  scheduleId: number,
  options?: CommonUseQueryOptions<ScheduleDetail>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getSchedule(scheduleId),
    queryFn: () => scheduleApi.getSchedule(scheduleId),
  });

  return query;
};
