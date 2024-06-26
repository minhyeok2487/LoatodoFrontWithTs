import { useMutation } from "@tanstack/react-query";

import * as friendsApi from "@core/apis/friend.api";
import type { CommonUseMutationOptions } from "@core/types/app";

export default (options?: CommonUseMutationOptions<number>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (friendId) => friendsApi.removeFriend(friendId),
  });

  return mutation;
};
