import { useMutation } from "@tanstack/react-query";

import * as friendsApi from "@core/apis/friend.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type {
  FriendSettings,
  UpdateFriendSettingRequest,
} from "@core/types/friend";

export default (
  options?: CommonUseMutationOptions<UpdateFriendSettingRequest, FriendSettings>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => friendsApi.updateFriendSetting(params),
  });

  return mutation;
};
