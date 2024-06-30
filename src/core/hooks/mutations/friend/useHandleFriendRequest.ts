import { useMutation } from "@tanstack/react-query";

import * as friendsApi from "@core/apis/friend.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { HandleFriendRequest } from "@core/types/friend";

export default (options?: CommonUseMutationOptions<HandleFriendRequest>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => friendsApi.handleFriendRequest(params),
  });

  return mutation;
};
