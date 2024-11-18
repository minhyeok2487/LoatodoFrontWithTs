import { useMutation } from "@tanstack/react-query";

import * as friendsApi from "@core/apis/friend.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { SendFriendRequest } from "@core/types/friend";

export default (options?: CommonUseMutationOptions<SendFriendRequest>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => friendsApi.sendFriendRequest(params),
  });

  return mutation;
};
