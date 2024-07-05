import { NoDataResponse } from "@core/types/api";
import {
  CreateScheduleRequest,
  ScheduleDetail,
  ScheduleItem,
  UpdateFriendsOfScheduleRequest,
  UpdateScheduleRequest,
} from "@core/types/schedule";

import mainAxios from "./mainAxios";

export const getSchedules = (): Promise<ScheduleItem[]> => {
  return mainAxios.get("/v4/schedule").then((res) => res.data);
};

export const getSchedule = (scheduleId: number): Promise<ScheduleDetail> => {
  return mainAxios.get(`/v4/schedule/${scheduleId}`).then((res) => res.data);
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
  return mainAxios.patch(`/v4/schedule/${scheduleId}/friend`, {
    addFriendCharacterIdList,
    removeFriendCharacterIdList,
  });
};
