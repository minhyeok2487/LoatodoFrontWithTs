import { useQuery } from "@tanstack/react-query";

import * as scheduleApi from "@core/apis/schedule.api";
import type { CommonUseQueryOptions } from "@core/types/app";
import type {
  GetScheduleDetailRequest,
  ScheduleDetail,
} from "@core/types/schedule";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (
  params: GetScheduleDetailRequest,
  options?: CommonUseQueryOptions<ScheduleDetail>
) => {
  const query = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getSchedule(params),
    queryFn: () => scheduleApi.getSchedule(params),
  });

  return query;
};
