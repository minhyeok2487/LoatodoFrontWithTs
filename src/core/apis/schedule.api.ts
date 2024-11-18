import type { Dayjs } from "dayjs";

import type { NoDataResponse } from "@core/types/api";
import type {
  CreateScheduleRequest,
  GetScheduleDetailRequest,
  ScheduleDetail,
  ScheduleItem,
  UpdateFriendsOfScheduleRequest,
  UpdateScheduleRequest,
} from "@core/types/schedule";

import mainAxios from "./mainAxios";

export const getSchedules = (day: Dayjs): Promise<ScheduleItem[]> => {
  return mainAxios
    .get("/v4/schedule", {
      params: {
        date: day.format("YYYY-MM-DD"),
      },
    })
    .then((res) => res.data);
};

export const getSchedule = ({
  scheduleId,
  leaderScheduleId,
}: GetScheduleDetailRequest): Promise<ScheduleDetail> => {
  return mainAxios
    .get(`/v4/schedule/${scheduleId}`, {
      params: {
        leaderScheduleId,
      },
    })
    .then((res) => res.data);
};

export const deleteSchedule = (scheduleId: number): Promise<NoDataResponse> => {
  return mainAxios.delete(`/v4/schedule/${scheduleId}`);
};

export const updateSchedule = ({
  scheduleId,
  dayOfWeek,
  memo,
  time,
}: UpdateScheduleRequest): Promise<NoDataResponse> => {
  return mainAxios.patch(`/v4/schedule/${scheduleId}`, {
    dayOfWeek,
    memo,
    time,
  });
};

export const createSchedule = (
  data: CreateScheduleRequest
): Promise<NoDataResponse> => {
  return mainAxios.post("/v4/schedule", data);
};

export const updateFriendsOfSchedule = ({
  scheduleId,
  addFriendCharacterIdList,
  removeFriendCharacterIdList,
}: UpdateFriendsOfScheduleRequest): Promise<NoDataResponse> => {
  return mainAxios.post(`/v4/schedule/${scheduleId}/friend`, {
    addFriendCharacterIdList,
    removeFriendCharacterIdList,
  });
};
