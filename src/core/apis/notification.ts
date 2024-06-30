import type { Notification, NotificationLink } from "@core/types/notification";

import mainAxios from "./mainAxios";

export const getNotifications = (): Promise<Notification[]> => {
  return mainAxios.get("/v4/notification").then((res) => res.data);
};

export const getLatestNotifiedAt = (): Promise<string> => {
  return mainAxios.get("/v4/notification/recent").then((res) => res.data);
};

export const readNotification = (
  notificationId: number
): Promise<NotificationLink> => {
  return mainAxios
    .get(`/v4/notification/${notificationId}`)
    .then((res) => res.data);
};
