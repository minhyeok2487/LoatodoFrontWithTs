export const BASE_URL = "https://api2.loatodo.com";
// export const BASE_URL = "http://localhost:8080";

export const RAID_SORT_ORDER = [
  "3막 모르둠",
  "2막 아브렐슈드",
  "1막 에기르",
  "베히모스",
  "에키드나",
  "카멘",
  "상아탑",
  "일리아칸",
  "카양겔",
  "아브렐슈드",
  "쿠크세이튼",
  "비아키스",
  "발탄",
  "아르고스"
];

export const TEST_ACCESS_TOKEN =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJxd2UyNDg3QGFqb3UuYWMua3IiLCJpc3MiOiJMb3N0YXJrVG9kbyIsImlhdCI6MTcxNDU1NzE1Nn0.vaGDOTDZzok2EnnCbsL0Dsse-yUx7c1QWSgoNoFzn4fMUcfhxlIL_ZuqIcW4ov1fotsUDFeCZp2W22emUWHWNQ";

export const STALE_TIME_MS = 1000 * 60 * 50;

export const LOCAL_STORAGE_KEYS = {
  accessToken: "ACCESS_TOKEN",
  theme: "theme",
  isDialOpen: "isDialOpen",
  todoServer: "todoServer",
  showWideAtom: "showWideAtom",
} as const;

export const WEEKDAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export const CUBE_TUPLE = [
  ["1금제", 1490],
  ["2금제", 1540],
  ["3금제", 1580],
  ["4금제", 1610],
  ["5금제", 1640],
  ["1해금", 1680],
  ["2해금", 1700],
  ["3해금", 9999]
] as const;

export const COMMUNITY_CATEGORY = {
  LIFE: "일상",
  FRIENDS: "깐부모집",
  GUILDS: "길드모집",
  PARTIES: "고정팟모집",
  BOARDS: "로투두공지",
  COMMENTS: "로투두건의사항",
} as const;

export const LOG_CONTENT = {
  CHAOS: "카오스던전/쿠르잔전선",
  GUARDIAN: "가디언토벌",
  RAID: "레이드",
  RAID_MORE_REWARD: "레이드더보기",
  CUBE: "큐브"
} as const;