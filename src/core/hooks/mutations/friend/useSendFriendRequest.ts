import { useMutation } from "@tanstack/react-query";

import * as friendsApi from "@core/apis/friend.api";
import type { CommonUseMutationOptions } from "@core/types/app";

export default (options?: CommonUseMutationOptions<string>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (username) => friendsApi.sendFriendRequest(username),
  });

  return mutation;
};
