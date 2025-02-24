import { useMutation } from "@tanstack/react-query";

import * as cubeApi from "@core/apis/cube.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { SpendWeekCubeRequest } from "@core/types/cube";

export default (options?: CommonUseMutationOptions<SpendWeekCubeRequest>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => cubeApi.spendCubeCharacter(params),
  });

  return mutation;
};
