import type { CommonUseQueryOptions } from "@core/types/app";
import type { ScheduleItem } from "@core/types/schedule";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";
import { useQuery } from "@tanstack/react-query";
import * as scheduleApi from '@core/apis/schedule.api';

export const useSchedulesMonth = (
  month: number,
  options?: CommonUseQueryOptions<ScheduleItem[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getSchedulesMonth(month),
    queryFn: () => scheduleApi.getSchedulesMonth(month),
  });

  return query;
};
