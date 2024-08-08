import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateCharacterMemoRequest } from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<UpdateCharacterMemoRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (paramObject) => characterApi.updateCharacterMemo(paramObject),
  });

  return mutation;
};
