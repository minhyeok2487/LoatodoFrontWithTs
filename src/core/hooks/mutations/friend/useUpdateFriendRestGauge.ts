import { useMutation } from "@tanstack/react-query";

import * as friendApi from "@core/apis/friend.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character } from "@core/types/character";
import type { UpdateFriendRestGaugeRequest } from "@core/types/friend";

export default (
  options?: CommonUseMutationOptions<UpdateFriendRestGaugeRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => friendApi.updateRestGauge(params),
  });

  return mutation;
};
