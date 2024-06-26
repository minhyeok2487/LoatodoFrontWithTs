import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { RegisterCharactersRequest } from "@core/types/auth";

export default (
  options?: CommonUseMutationOptions<RegisterCharactersRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => authApi.registerCharacters(params),
  });

  return mutation;
};
