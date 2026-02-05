import { useMutation } from "@tanstack/react-query";

import * as inspectionApi from "@core/apis/inspection.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { InspectionDashboard } from "@core/types/inspection";

const useRefreshInspectionCharacter = (
  options?: CommonUseMutationOptions<number, InspectionDashboard>
) => {
  return useMutation({
    ...options,
    mutationFn: (inspectionCharacterId: number) =>
      inspectionApi.refreshInspectionCharacter(inspectionCharacterId),
  });
};

export default useRefreshInspectionCharacter;
