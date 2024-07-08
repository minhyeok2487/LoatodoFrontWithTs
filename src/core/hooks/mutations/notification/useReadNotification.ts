import { useMutation } from "@tanstack/react-query";

import * as notificationApi from "@core/apis/notification.api";
import type { CommonUseMutationOptions } from "@core/types/app";

export default (options?: CommonUseMutationOptions<number>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (notificationId) =>
      notificationApi.readNotification(notificationId),
  });

  return mutation;
};
