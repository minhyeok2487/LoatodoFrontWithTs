import { useMutation } from "@tanstack/react-query";

import * as memberApi from "@core/apis/member.api";
import type { OkResponse } from "@core/types/api";
import type { UseMutationWithParams } from "@core/types/app";

const useResetCharacters = (
  options?: UseMutationWithParams<void, OkResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: () => memberApi.resetCharacters(),
  });

  return mutation;
};

export default useResetCharacters;
