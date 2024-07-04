import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";

import * as notificationApi from "@core/apis/notification.api";
import { STALE_TIME_MS } from "@core/constants";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { Notification } from "@core/types/notification";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

type OnReceiveNotification = (
  message: string,
  notification: Notification
) => void;

export default (
  options?: CommonUseQueryOptions<Notification[]>,
  onReceiveNotification?: OnReceiveNotification
) => {
  // 콜백을 보냈던 메세지 id
  const lastNotifiedId = useRef<number>();

  const getNotifications = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getNotifications(),
    queryFn: () => notificationApi.getNotifications(),
    staleTime: STALE_TIME_MS, // 임시
  });
  const getNotificationStatus = useQuery({
    queryKey: queryKeyGenerator.getNotificationStatus(),
    queryFn: () => notificationApi.getNotificationStatus(),
    refetchInterval: 1000 * 5,
  });

  useEffect(() => {
    if (
      getNotificationStatus.data &&
      dayjs(getNotifications.dataUpdatedAt).diff(
        dayjs(getNotificationStatus.data.latestCreatedDate),
        "milliseconds"
      ) < 0
    ) {
      // 알림 목록 업데이트 시간이 최근 알림 시간보다 과거라면 알림 목록 갱신
      getNotifications.refetch();
    }
  }, [getNotifications, getNotificationStatus]);

  useEffect(() => {
    if (
      getNotifications.data &&
      getNotificationStatus.data &&
      dayjs(getNotificationStatus.data.latestCreatedDate).diff(
        dayjs(getNotifications.dataUpdatedAt),
        "milliseconds"
      ) < 0
    ) {
      // 최근 알림 시간이 알림 목록 업데이트 시간보다 과거이고
      const message = getNotifications.data?.[0];

      if (message) {
        if (lastNotifiedId.current === undefined) {
          lastNotifiedId.current = message.id;
        } else if (lastNotifiedId.current !== message.id) {
          // 콜백에 내보낸 메세지가 아니라면 콜백 호출
          onReceiveNotification?.(
            message.notificationType === "FRIEND"
              ? `${message.data.friendCharacterName}${message.content}`
              : message.content,
            message
          );

          lastNotifiedId.current = message.id;
        }
      }
    }
  }, [getNotifications.data, getNotificationStatus.data]);

  return {
    getNotifications,
    getNotificationStatus,
  };
};
