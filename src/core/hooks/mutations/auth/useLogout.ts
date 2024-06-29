import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { OkResponse } from "@core/types/api";
import type { UseMutationWithParams } from "@core/types/app";

const useLogout = (options?: UseMutationWithParams<void, OkResponse>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: () => authApi.logout(),
  });

  return mutation;
};

export default useLogout;
