import { useQueries } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useRef } from "react";

import * as notificationApi from "@core/apis/notification.api";
import { authAtom, authCheckedAtom } from "@core/atoms/auth.atom";
import { STALE_TIME_MS } from "@core/constants";
import type { CommonUseQueryOptions } from "@core/types/app";
import type {
  Notification,
  NotificationStatus,
} from "@core/types/notification";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

type OnReceiveNotification = (
  message: string,
  notification: Notification
) => void;

export default (
  onReceiveNotification: OnReceiveNotification,
  options?: Omit<CommonUseQueryOptions<Notification[]>, "enabled">
) => {
  const auth = useAtomValue(authAtom);
  const authChecked = useAtomValue(authCheckedAtom);
  // 콜백을 보냈던 메세지 id
  const lastNotifiedId = useRef<number>();

  const combine = useCallback(
    (
      results: [
        UseQueryResult<Notification[], Error>,
        UseQueryResult<NotificationStatus, Error>,
      ]
    ) => {
      return {
        getNotifications: results[0],
        getNotificationStatus: results[1],
      };
    },
    []
  );

  const { getNotifications, getNotificationStatus } = useQueries({
    queries: [
      {
        queryKey: queryKeyGenerator.getNotifications(),
        queryFn: () => notificationApi.getNotifications(),
        staleTime: STALE_TIME_MS, // 임시
        enabled: authChecked,
        ...options,
      },
      {
        queryKey: queryKeyGenerator.getNotificationStatus(),
        queryFn: () => notificationApi.getNotificationStatus(),
        refetchInterval: 1000 * 3,
        enabled: authChecked,
      },
    ],
    combine,
  });

  useEffect(() => {
    // 토큰 변동 시 onReceiveNotification 호출 방지를 위해 초기화
    if (authChecked) {
      lastNotifiedId.current = undefined;
    }
  }, [authChecked, auth.token]);

  useEffect(() => {
    if (
      getNotifications.data &&
      getNotificationStatus.data &&
      dayjs(getNotificationStatus.data.latestCreatedDate).isAfter(
        getNotifications.dataUpdatedAt,
        "milliseconds"
      )
    ) {
      // 최신 알림 시간 > 알림 목록 업데이트 시간 이라면 알림 목록 갱신
      getNotifications.refetch();
    }
  }, [getNotificationStatus.dataUpdatedAt]);

  useEffect(() => {
    if (
      getNotifications.data &&
      getNotificationStatus.data &&
      getNotificationStatus.data.accessToken === auth.token &&
      dayjs(getNotifications.dataUpdatedAt).isAfter(
        getNotificationStatus.data.latestCreatedDate,
        "milliseconds"
      )
    ) {
      // 알림 목록 업데이트 시간 > 최신 알림 시간이 알림 이고
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
  }, [getNotifications.dataUpdatedAt, getNotificationStatus.data]);

  return {
    getNotifications,
    getNotificationStatus,
  };
};
