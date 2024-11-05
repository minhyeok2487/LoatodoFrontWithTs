import type { QueryKey } from "@tanstack/react-query";
import type { Dayjs } from "dayjs";

import type { GetCommentsRequest } from "@core/types/comment";
import type { GetCommunityListRequest } from "@core/types/community";
import type { GetNoticeListRequest } from "@core/types/notice";
import type { GetScheduleDetailRequest } from "@core/types/schedule";
import type { GetAvaiableRaidsRequest } from "@core/types/todo";

const defaultKeys = {
  GET_MY_INFORMATION: "GET_MY_INFORMATION",
  GET_CHARACTERS: "GET_CHARACTERS",
  GET_AVAILABLE_RAIDS: "GET_AVAILABLE_RAIDS",
  GET_FRIENDS: "GET_FRIENDS",
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
  GET_CUSTOM_TODOS: "GET_CUSTOM_TODOS",
  GET_CUBE_CHARACTERS: "GET_CUBE_CHARACTERS",
  GET_CUBE_REWARDS: "GET_CUBE_REWARDS",
  GET_COMMUNITY_LIST: "GET_COMMUNITY_LIST",
  GET_COMMUNITY_ID: "GET_COMMUNITY_ID",
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
  getAvailableRaids: (params?: GetAvaiableRaidsRequest) => {
    return withParamGenerator(defaultKeys.GET_AVAILABLE_RAIDS, params);
  },
  getFriends: () => {
    return withParamGenerator(defaultKeys.GET_FRIENDS);
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
  getSchedules: (day?: Dayjs) => {
    return withParamGenerator(
      defaultKeys.GET_SCHEDULES,
      day?.format("YYYY-MM-DD")
    );
  },
  getSchedule: (params?: GetScheduleDetailRequest) => {
    return withParamGenerator(defaultKeys.GET_SCHEDULE, params);
  },
  getWeekRaidCategories: () => {
    return withParamGenerator(defaultKeys.GET_WEEK_RAID_CATEGORIES);
  },
  getCustomTodos: (friendUsername?: string) => {
    return withParamGenerator(defaultKeys.GET_CUSTOM_TODOS, friendUsername);
  },
  getCubeCharacters: () => {
    return withParamGenerator(defaultKeys.GET_CUBE_CHARACTERS);
  },
  getCubeRewards: () => {
    return withParamGenerator(defaultKeys.GET_CUBE_REWARDS);
  },
  getCommunityList: (params?: GetCommunityListRequest) => {
    return withParamGenerator(defaultKeys.GET_COMMUNITY_LIST, params);
  },
  getCommunityPost: (communityId?: number) => {
    return withParamGenerator(defaultKeys.GET_COMMUNITY_ID, communityId);
  },
};

export default queryKeyGenerator;
