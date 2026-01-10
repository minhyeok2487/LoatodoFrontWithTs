import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as adminApi from "@core/apis/admin.api";
import type {
  AdminNotificationListParams,
  AdminBroadcastRequest,
} from "@core/types/admin";

export const useNotifications = (params: AdminNotificationListParams = {}) => {
  return useQuery({
    queryKey: ["admin", "notifications", params],
    queryFn: () => adminApi.getNotifications(params),
    staleTime: 1000 * 60 * 2,
  });
};

export const useSendBroadcast = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminBroadcastRequest) => adminApi.sendBroadcast(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => adminApi.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });
};
