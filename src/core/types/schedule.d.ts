import { WEEKDAYS } from "@core/constants";

import type { ClassName } from "./lostark";

export interface ScheduleItem {
  scheduleId: number;
  scheduleCategory: ScheduleCategory;
  scheduleRaidCategory: ScheduleRaidCategory;
  characterName: string;
  dayOfWeek: Weekday;
  raidName: string;
  time: string;
  memo: string;
  isLeader: boolean;
  leaderScheduleId: number;
  leaderCharacterName: string;
  friendCharacterNames: string[];
}

export interface GetScheduleDetailRequest {
  scheduleId: number;
  leaderScheduleId?: number;
}

export interface ScheduleDetail {
  scheduleId: number;
  scheduleCategory: ScheduleCategory;
  scheduleRaidCategory: ScheduleRaidCategory;
  raidName: string;
  time: string;
  memo: string;
  dayOfWeek: Weekday;
  repeatWeek: boolean;
  character: ScheduleCharacter;
  friendList: ScheduleCharacter[] | null;
  leader: boolean;
}

export interface UpdateScheduleRequest {
  scheduleId: number;
  dayOfWeek: Weekday;
  memo: string;
  time: string;
}

export interface CreateScheduleRequest {
  dayOfWeek: Weekday;
  friendCharacterIdList: number[];
  leaderCharacterId: number;
  memo: string;
  raidLevel?: number;
  raidName: string;
  repeatWeek: boolean;
  scheduleCategory: ScheduleCategory;
  scheduleRaidCategory: ScheduleRaidCategory;
  time: string;
}

export interface UpdateFriendsOfScheduleRequest {
  scheduleId: number;
  addFriendCharacterIdList: number[];
  removeFriendCharacterIdList: number[];
}

interface ScheduleCharacter {
  characterId: number;
  characterClassName: ClassName;
  characterImage: string;
  characterName: string;
  itemLevel: number;
}

type Weekday = (typeof WEEKDAYS)[number];

type ScheduleCategory = "ALONE" | "PARTY";

type ScheduleRaidCategory = "GUARDIAN" | "RAID" | "ETC";
