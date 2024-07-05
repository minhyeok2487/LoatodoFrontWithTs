import type { ClassName } from "./lostark";

type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

const WeekdayE = {
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
  7: "SUNDAY",
} as const;

interface Time {
  hour: number;
  munute: number;
  second: number;
  nano: number;
}

interface ScheduleCharacter {
  characterId: number;
  characterClassName: ClassName;
  characterImage: string;
  characterName: string;
  itemLevel: number;
}

export interface ScheduleItem {
  scheduleId: number;
  characterName: string;
  dayOfWeek: Weekday;
  raidName: string;
  scheduleCategory: string;
  scheduleRaidCategory: string;
  time: Time;
}

export interface ScheduleDetail extends Omit<ScheduleItem, "characterName"> {
  character: ScheduleCharacter;
  friendList: ScheduleCharacter[];
  memo: string;
  repeatWeek: boolean;
}

export interface UpdateScheduleRequest {
  scheduleId: number;
  dayOfWeek: Weekday;
  memo: string;
  time: Time;
}

export interface CreateScheduleRequest {
  dayOfWeek: Weekday;
  friendCharacterIdList: number[];
  leaderCharacterId: number;
  memo: string;
  raidLevel: number;
  raidName: number;
  repeatWeek: boolean;
  scheduleCategory: string;
  scheduleRaidCategory: string;
  time: `${number}${number}:${number}0`;
}

export interface UpdateFriendsOfScheduleRequest {
  scheduleId: number;
  addFriendCharacterIdList: number[];
  removeFriendCharacterIdList: number[];
}
