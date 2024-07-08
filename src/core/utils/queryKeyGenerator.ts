import type { QueryKey } from "@tanstack/react-query";

import type {
  CubeName,
  GetAvailableWeeklyRaidsRequest,
} from "@core/types/character";
import type { GetCommentsRequest } from "@core/types/comment";
import type { GetAvaiableFriendWeeklyRaidsRequest } from "@core/types/friend";
import type { GetNoticeListRequest } from "@core/types/notice";

const defaultKeys = {
  GET_MY_INFORMATION: "GET_MY_INFORMATION",
  GET_CHARACTERS: "GET_CHARACTERS",
  GET_AVAILABLE_WEEKLY_RAIDS: "GET_AVAILABLE_WEEKLY_RAIDS",
  GET_CUBE_REWARD: "GET_CUBE_REWARD",
  GET_FRIENDS: "GET_FRIENDS",
  GET_AVAILABLE_FRIEND_WEEKLY_RAIDS: "GET_AVAILABLE_FRIEND_WEEKLY_RAIDS",
  SEARCH_CHARACTER: "SEARCH_CHARACTER",
  GET_COMMENTS: "GET_COMMENTS",
  GET_OFFICIAL_NOTICES: "GET_OFFICIAL_NOTICES",
  GET_NOTICES: "GET_NOTICES",
  GET_NOTICE: "GET_NOTICE",
  GET_NOTIFICATIONS: "GET_NOTIFICATIONS",
  GET_NOTIFICATION_STATUS: "GET_NOTIFICATION_STATUS",
  GET_SCHEDULES: "GET_SCHEDULES",
  GET_SCHEDULE: "GET_SCHEDULE",
  GET_WEEK_RAID_CATEGORIES: "GET_WEEK_RAID_CATEGORIES",
} as const;

const withParamGenerator = (
  defaultQueryKey: keyof typeof defaultKeys,
  param?: unknown
): QueryKey => {
  return param !== undefined ? [defaultQueryKey, param] : [defaultQueryKey];
};

const queryKeyGenerator = {
  getMyInformation: () => {
    return withParamGenerator(defaultKeys.GET_MY_INFORMATION);
  },
  searchCharacter: (characterName?: string) => {
    return withParamGenerator(defaultKeys.SEARCH_CHARACTER, characterName);
  },
  getCharacters: () => {
    return withParamGenerator(defaultKeys.GET_CHARACTERS);
  },
  getAvailableWeeklyRaids: (params?: GetAvailableWeeklyRaidsRequest) => {
    return withParamGenerator(defaultKeys.GET_AVAILABLE_WEEKLY_RAIDS, params);
  },
  getCubeReward: (name?: CubeName) => {
    return withParamGenerator(defaultKeys.GET_CUBE_REWARD, name);
  },
  getFriends: () => {
    return withParamGenerator(defaultKeys.GET_FRIENDS);
  },
  getAvailableFriendWeeklyRaids: (
    params?: GetAvaiableFriendWeeklyRaidsRequest
  ) => {
    return withParamGenerator(
      defaultKeys.GET_AVAILABLE_FRIEND_WEEKLY_RAIDS,
      params
    );
  },
  getComments: (params?: GetCommentsRequest) => {
    return withParamGenerator(defaultKeys.GET_COMMENTS, params);
  },
  getOfficialNotices: (params?: GetNoticeListRequest) => {
    return withParamGenerator(defaultKeys.GET_OFFICIAL_NOTICES, params);
  },
  getNotices: (params?: GetNoticeListRequest) => {
    return withParamGenerator(defaultKeys.GET_NOTICES, params);
  },
  getNotice: (noticeId?: number) => {
    return withParamGenerator(defaultKeys.GET_NOTICE, noticeId);
  },
  getNotifications: () => {
    return withParamGenerator(defaultKeys.GET_NOTIFICATIONS);
  },
  getNotificationStatus: () => {
    return withParamGenerator(defaultKeys.GET_NOTIFICATION_STATUS);
  },
  getSchedules: () => {
    return withParamGenerator(defaultKeys.GET_SCHEDULES);
  },
  getSchedule: (scheduleId?: number) => {
    return withParamGenerator(defaultKeys.GET_SCHEDULE, scheduleId);
  },
  getWeekRaidCategories: () => {
    return withParamGenerator(defaultKeys.GET_WEEK_RAID_CATEGORIES);
  },
};

export default queryKeyGenerator;
