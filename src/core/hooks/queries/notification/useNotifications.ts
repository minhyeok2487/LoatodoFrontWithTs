import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import * as notificationApi from "@core/apis/notification";
import type { CommonUseQueryOptions } from "@core/types/app";
import type { Notification } from "@core/types/notification";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export default (options?: CommonUseQueryOptions<Notification[]>) => {
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const [latestNotification, setLatestNotification] =
    useState<Notification | null>(null);

  const getNotifications = useQuery({
    ...options,
    queryKey: queryKeyGenerator.getNotifications(),
    queryFn: () => notificationApi.getNotifications(),
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
          "millisecond"
        ) > 0
      ) {
        getNotifications.refetch();
        setHasNewNotification(true);
      }
    }
  }, [getLatestNotifiedAt.data, getNotifications.dataUpdatedAt]);

  useEffect(() => {
    if (hasNewNotification) {
      getNotifications.data?.[0] &&
        setLatestNotification(getNotifications.data[0]);
    }
  }, [hasNewNotification, getNotifications.data]);

  return {
    getNotifications,
    hasNewNotification,
    latestNotification,
  };
};
