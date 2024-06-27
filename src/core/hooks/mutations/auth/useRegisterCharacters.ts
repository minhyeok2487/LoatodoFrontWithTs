import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { OkResponse } from "@core/types/api";
import type { UseMutationWithParams } from "@core/types/app";
import type { RegisterCharactersRequest } from "@core/types/auth";

const useRegisterCharacters = (
  options?: UseMutationWithParams<RegisterCharactersRequest, OkResponse>
) => {
  const registerCharacters = useMutation({
    ...options,
    mutationFn: (params) => authApi.registerCharacters(params),
  });

  return registerCharacters;
};

export default useRegisterCharacters;
