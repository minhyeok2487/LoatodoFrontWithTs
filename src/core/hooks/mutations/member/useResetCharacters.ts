import { useMutation } from "@tanstack/react-query";

import * as memberApi from "@core/apis/member.api";
import type { CommonUseMutationOptions } from "@core/types/app";

export default (options?: CommonUseMutationOptions) => {
  const mutation = useMutation({
    ...options,
    mutationFn: () => memberApi.resetCharacters(),
  });

  return mutation;
};
