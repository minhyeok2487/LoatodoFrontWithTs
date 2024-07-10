import type { Weekday } from "@core/types/schedule";

export const getWeekdayNumber = (weekday: Weekday): number => {
  switch (weekday) {
    case "MONDAY":
      return 1;
    case "TUESDAY":
      return 2;
    case "WEDNESDAY":
      return 3;
    case "THURSDAY":
      return 4;
    case "FRIDAY":
      return 5;
    case "SATURDAY":
      return 6;
    default:
      return 0;
  }
};
