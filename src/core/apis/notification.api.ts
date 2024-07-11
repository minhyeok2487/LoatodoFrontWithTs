import type { NoDataResponse } from "@core/types/api";
import type {
  Notification,
  NotificationStatus,
} from "@core/types/notification";

import mainAxios from "./mainAxios";

export const getNotifications = (): Promise<Notification[]> => {
  return mainAxios.get("/v4/notification").then((res) => res.data);
};

export const getNotificationStatus = (): Promise<NotificationStatus> => {
  return mainAxios.get("/v4/notification/status").then((res) => res.data);
};

export const readNotification = (
  notificationId: number
): Promise<NoDataResponse> => {
  return mainAxios.post(`/v4/notification/${notificationId}`);
};
