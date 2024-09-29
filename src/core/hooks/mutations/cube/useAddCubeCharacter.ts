import { useMutation } from "@tanstack/react-query";

import * as cubeApi from "@core/apis/cube.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { AddCubeCharacterRequest, CubeCharacter } from "@core/types/cube";

export default (
  options?: CommonUseMutationOptions<AddCubeCharacterRequest, CubeCharacter>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => cubeApi.addCubeCharacter(params),
  });

  return mutation;
};
