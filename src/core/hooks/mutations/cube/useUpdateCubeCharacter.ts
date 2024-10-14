import { useMutation } from "@tanstack/react-query";

import * as cubeApi from "@core/apis/cube.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type {
  CubeCharacter,
  UpdateCubeCharacterRequest,
} from "@core/types/cube";

export default (
  options?: CommonUseMutationOptions<UpdateCubeCharacterRequest, CubeCharacter>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => cubeApi.updateCubeCharacter(params),
  });

  return mutation;
};
