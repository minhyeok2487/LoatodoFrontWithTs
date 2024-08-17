import { useMutation } from "@tanstack/react-query";

import * as friendApi from "@core/apis/friend.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UpdateFriendTodoRaidListRequest } from "@core/types/friend";

export default (
  options?: CommonUseMutationOptions<UpdateFriendTodoRaidListRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => friendApi.updateTodoRaidList(params),
  });

  return mutation;
};
