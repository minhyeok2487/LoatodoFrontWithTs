import { useMutation } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { ToggleGoldRaidRequest } from "@core/types/todo";

export default (options?: CommonUseMutationOptions<ToggleGoldRaidRequest>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.toggleGoldRaid(params),
  });

  return mutation;
};
