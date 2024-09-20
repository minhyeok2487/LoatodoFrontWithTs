import { useMutation } from "@tanstack/react-query";

import * as cubeApi from "@core/apis/cube.api";
import type { CommonUseMutationOptions } from "@core/types/app";

export default (options?: CommonUseMutationOptions<number>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => cubeApi.removeCubeCharacter(params),
  });

  return mutation;
};
