import { useMutation } from "@tanstack/react-query";

import * as friendsApi from "@core/apis/friend.api";
import { OkResponse } from "@core/types/api";
import { CommonUseMutationOptions } from "@core/types/app";

const useRemoveFriend = (
  options?: CommonUseMutationOptions<OkResponse, number>
) => {
  const removeFriend = useMutation({
    ...options,
    mutationFn: (friendId) => friendsApi.removeFriend(friendId),
  });

  return removeFriend;
};

export default useRemoveFriend;
