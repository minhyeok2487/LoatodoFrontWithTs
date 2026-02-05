import { useMutation } from "@tanstack/react-query";

import * as inspectionApi from "@core/apis/inspection.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type {
  CreateInspectionCharacterRequest,
  InspectionCharacter,
} from "@core/types/inspection";

const useCreateInspectionCharacter = (
  options?: CommonUseMutationOptions<
    CreateInspectionCharacterRequest,
    InspectionCharacter
  >
) => {
  return useMutation({
    ...options,
    mutationFn: (request) =>
      inspectionApi.createInspectionCharacter(request),
  });
};

export default useCreateInspectionCharacter;
