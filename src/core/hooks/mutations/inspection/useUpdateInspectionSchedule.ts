import { useMutation } from "@tanstack/react-query";

import * as inspectionApi from "@core/apis/inspection.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateInspectionScheduleRequest } from "@core/types/inspection";

const useUpdateInspectionSchedule = (
  options?: CommonUseMutationOptions<UpdateInspectionScheduleRequest>
) => {
  return useMutation({
    ...options,
    mutationFn: (request: UpdateInspectionScheduleRequest) =>
      inspectionApi.updateInspectionSchedule(request),
  });
};

export default useUpdateInspectionSchedule;
