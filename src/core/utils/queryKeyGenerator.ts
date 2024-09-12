import type { QueryKey } from "@tanstack/react-query";
import type { Dayjs } from "dayjs";

import type { CubeName } from "@core/types/character";
import type { GetCommentsRequest } from "@core/types/comment";
import type { GetNoticeListRequest } from "@core/types/notice";
import type { GetRecruitingsRequest } from "@core/types/recruiting";
import type { GetScheduleDetailRequest } from "@core/types/schedule";
import type { GetAvaiableRaidsRequest } from "@core/types/todo";

const defaultKeys = {
  GET_MY_INFORMATION: "GET_MY_INFORMATION",
  GET_CHARACTERS: "GET_CHARACTERS",
  GET_AVAILABLE_RAIDS: "GET_AVAILABLE_RAIDS",
  GET_CUBE_REWARD: "GET_CUBE_REWARD",
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
  GET_RECRUITINGS: "GET_RECRUITINGS",
  GET_RECRUITING: "GET_RECRUITING",
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
  getCubeReward: (name?: CubeName) => {
    return withParamGenerator(defaultKeys.GET_CUBE_REWARD, name);
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
    return withParamGenerator(defaultKeys.GET_CUSTOM_TODOS);
  },
  getRecruitings: (params?: GetRecruitingsRequest) => {
    return withParamGenerator(defaultKeys.GET_RECRUITINGS, params);
  },
  getRecruiting: (recruitingBoardId?: number) => {
    return withParamGenerator(defaultKeys.GET_RECRUITING, recruitingBoardId);
  },
};

export default queryKeyGenerator;
