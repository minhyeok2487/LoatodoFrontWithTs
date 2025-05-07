import type { NoDataResponse } from "@core/types/api";
import type {
  Notification,
  NotificationStatus,
} from "@core/types/notification";

import mainAxios from "./mainAxios";

export const getNotifications = (): Promise<Notification[]> => {
  return mainAxios.get("/api/v1/notification").then((res) => res.data);
};

export const getNotificationStatus = (): Promise<NotificationStatus> => {
  return mainAxios.get("/api/v1/notification/status").then((res) => {
    return {
      accessToken: (
        (res.config.headers?.Authorization as string) || ""
      ).replace("Bearer ", ""),
      ...res.data,
    };
  });
};

export const readNotification = (
  notificationId: number
): Promise<NoDataResponse> => {
  return mainAxios.post(`/api/v1/notification/${notificationId}`);
};

export const readAllNotification = (): Promise<NoDataResponse> => {
  return mainAxios.post("/api/v1/notification/all");
};
