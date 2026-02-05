import { useMutation } from "@tanstack/react-query";

import * as inspectionApi from "@core/apis/inspection.api";
import type { CommonUseMutationOptions } from "@core/types/app";

const useDeleteInspectionCharacter = (
  options?: CommonUseMutationOptions<number>
) => {
  return useMutation({
    ...options,
    mutationFn: (inspectionCharacterId: number) =>
      inspectionApi.deleteInspectionCharacter(inspectionCharacterId),
  });
};

export default useDeleteInspectionCharacter;
