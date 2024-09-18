// export const BASE_URL = "https://api2.loatodo.com";
export const BASE_URL = "http://localhost:8080";

export const RAID_SORT_ORDER = [
  "에기르",
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
];

export const TEST_ACCESS_TOKEN =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJxd2UyNDg3QGFqb3UuYWMua3IiLCJpc3MiOiJMb3N0YXJrVG9kbyIsImlhdCI6MTcxNDU1NzE1Nn0.vaGDOTDZzok2EnnCbsL0Dsse-yUx7c1QWSgoNoFzn4fMUcfhxlIL_ZuqIcW4ov1fotsUDFeCZp2W22emUWHWNQ";

export const STALE_TIME_MS = 1000 * 60 * 50;

export const LOCAL_STORAGE_KEYS = {
  accessToken: "ACCESS_TOKEN",
  theme: "theme",
  isDialOpen: "isDialOpen",
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
