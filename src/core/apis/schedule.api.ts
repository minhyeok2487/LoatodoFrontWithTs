import type { Dayjs } from "dayjs";

import type { NoDataResponse } from "@core/types/api";
import type {
  CreateScheduleRequest,
  GetScheduleDetailRequest,
  GetScheduleMonthRequest,
  ScheduleDetail,
  ScheduleItem,
  UpdateFriendsOfScheduleRequest,
  UpdateScheduleRequest,
} from "@core/types/schedule";

import mainAxios from "./mainAxios";

export const getSchedulesMonth = ({
  year,
  month,
}: GetScheduleMonthRequest): Promise<ScheduleItem[]> => {
  return mainAxios.get<ScheduleItem[]>("/api/v1/schedule", {
    params: { year, month },
  }).then((res) => res.data);
};

export const getSchedule = ({
  scheduleId,
  leaderScheduleId,
}: GetScheduleDetailRequest): Promise<ScheduleDetail> => {
  return mainAxios
    .get(`/api/v1/schedule/${scheduleId}`, {
      params: {
        leaderScheduleId,
      },
    })
    .then((res) => res.data);
};

export const deleteSchedule = (scheduleId: number): Promise<NoDataResponse> => {
  return mainAxios.delete(`/api/v1/schedule/${scheduleId}`);
};

export const updateSchedule = ({
  scheduleId,
  dayOfWeek,
  memo,
  time,
  date,
}: UpdateScheduleRequest): Promise<NoDataResponse> => {
  return mainAxios.patch(`/api/v1/schedule/${scheduleId}`, {
    dayOfWeek,
    memo,
    time,
    date,
  });
};

export const createSchedule = (
  data: CreateScheduleRequest
): Promise<NoDataResponse> => {
  return mainAxios.post("/api/v1/schedule", data);
};

export const updateFriendsOfSchedule = ({
  scheduleId,
  addFriendCharacterIdList,
  removeFriendCharacterIdList,
}: UpdateFriendsOfScheduleRequest): Promise<NoDataResponse> => {
  return mainAxios.post(`/api/v1/schedule/${scheduleId}/friend`, {
    addFriendCharacterIdList,
    removeFriendCharacterIdList,
  });
};
