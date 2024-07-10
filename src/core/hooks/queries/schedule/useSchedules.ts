import { useQuery } from "@tanstack/react-query";
import type { Dayjs } from "dayjs";

import * as scheduleApi from "@core/apis/schedule.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { ScheduleItem } from "@core/types/schedule";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  day: Dayjs,
  options?: CommonUseQueryOptions<ScheduleItem[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getSchedules(day),
    queryFn: () => scheduleApi.getSchedules(day),
  });

  return query;
};
