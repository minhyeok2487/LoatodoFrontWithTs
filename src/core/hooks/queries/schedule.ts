import type { CommonUseQueryOptions } from "@core/types/app";
import type { GetScheduleMonthRequest, ScheduleItem } from "@core/types/schedule";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";
import { useQuery } from "@tanstack/react-query";
import * as scheduleApi from '@core/apis/schedule.api';

export const useSchedulesMonth = (
  params: GetScheduleMonthRequest,
  options?: CommonUseQueryOptions<ScheduleItem[]>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getSchedulesMonth(params),
    queryFn: () => scheduleApi.getSchedulesMonth(params),
  });

  return query;
};
