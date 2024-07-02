import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import * as notificationApi from "@core/apis/notification";
import { STALE_TIME_MS } from "@core/constants";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { Notification } from "@core/types/notification";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

type OnReceiveNotification = (notification: Notification) => void;

export default (
  options?: CommonUseQueryOptions<Notification[]>,
  onReceiveNotification?: OnReceiveNotification
) => {
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const getNotifications = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getNotifications(),
    queryFn: () => notificationApi.getNotifications(),
    staleTime: STALE_TIME_MS, // 임시
  });
  const getLatestNotifiedAt = useQuery({
    queryKey: queryKeyGenerator.getLatestNotifiedAt(),
    queryFn: () => notificationApi.getLatestNotifiedAt(),
    refetchInterval: 1000 * 3,
  });

  useEffect(() => {
    if (getLatestNotifiedAt.data) {
      if (
        dayjs(getLatestNotifiedAt.data).diff(
          dayjs(getNotifications.dataUpdatedAt),
          "milliseconds"
        ) > 0
      ) {
        getNotifications.refetch();
        setHasNewNotification(true);
      }
    }
  }, [getLatestNotifiedAt.data, getNotifications.dataUpdatedAt]);

  useEffect(() => {
    if (
      hasNewNotification &&
      dayjs(getNotifications.dataUpdatedAt).diff(
        dayjs(getLatestNotifiedAt.data),
        "milliseconds"
      ) > 0
    ) {
      getNotifications.data?.[0] &&
        onReceiveNotification?.(getNotifications.data[0]);
    }
  }, [hasNewNotification, getNotifications]);

  return {
    getNotifications,
    hasNewNotification,
  };
};
