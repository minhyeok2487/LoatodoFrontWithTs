import { useMutation } from "@tanstack/react-query";

import * as inspectionApi from "@core/apis/inspection.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateInspectionCharacterRequest } from "@core/types/inspection";

interface UpdateParams {
  inspectionCharacterId: number;
  request: UpdateInspectionCharacterRequest;
}

const useUpdateInspectionCharacter = (
  options?: CommonUseMutationOptions<UpdateParams>
) => {
  return useMutation({
    ...options,
    mutationFn: ({ inspectionCharacterId, request }: UpdateParams) =>
      inspectionApi.updateInspectionCharacter(inspectionCharacterId, request),
  });
};

export default useUpdateInspectionCharacter;
