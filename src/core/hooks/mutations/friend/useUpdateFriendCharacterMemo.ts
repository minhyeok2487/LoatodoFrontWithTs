import { useMutation } from "@tanstack/react-query";

import * as friendApi from "@core/apis/friend.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateFriendCharacterMemoRequest } from "@core/types/friend";

export default (
  options?: CommonUseMutationOptions<UpdateFriendCharacterMemoRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (paramObject) => friendApi.updateCharacterMemo(paramObject),
  });

  return mutation;
};
