import type { FormOptions } from "@core/types/app";
import type {
  ScheduleCategory,
  ScheduleRaidCategory,
  Weekday,
} from "@core/types/schedule";

export const scheduleRaidCategoryOptions: FormOptions<ScheduleRaidCategory> = [
  { value: "GUARDIAN", label: "가디언 토벌" },
  { value: "RAID", label: "레이드" },
  { value: "ETC", label: "기타" },
];

export const scheduleCategoryOptions: FormOptions<ScheduleCategory> = [
  { value: "ALONE", label: "내 일정" },
  { value: "PARTY", label: "깐부 일정" },
];

export const weekdayOptions: FormOptions<Weekday> = [
  { value: "MONDAY", label: "월" },
  { value: "TUESDAY", label: "화" },
  { value: "WEDNESDAY", label: "수" },
  { value: "THURSDAY", label: "목" },
  { value: "FRIDAY", label: "금" },
  { value: "SATURDAY", label: "토" },
  { value: "SUNDAY", label: "일" },
];

export const hourOptions: FormOptions<number> = [
  { value: 0, label: "AM 12" },
  { value: 1, label: "AM 01" },
  { value: 2, label: "AM 02" },
  { value: 3, label: "AM 03" },
  { value: 4, label: "AM 04" },
  { value: 5, label: "AM 05" },
  { value: 6, label: "AM 06" },
  { value: 7, label: "AM 07" },
  { value: 8, label: "AM 08" },
  { value: 9, label: "AM 09" },
  { value: 10, label: "AM 10" },
  { value: 11, label: "AM 11" },
  { value: 12, label: "PM 12" },
  { value: 13, label: "PM 01" },
  { value: 14, label: "PM 02" },
  { value: 15, label: "PM 03" },
  { value: 16, label: "PM 04" },
  { value: 17, label: "PM 05" },
  { value: 18, label: "PM 06" },
  { value: 19, label: "PM 07" },
  { value: 20, label: "PM 08" },
  { value: 21, label: "PM 09" },
  { value: 22, label: "PM 10" },
  { value: 23, label: "PM 11" },
];

export const minuteOptions: FormOptions<number> = [
  { value: 0, label: "00" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 30, label: "30" },
  { value: 40, label: "40" },
  { value: 50, label: "50" },
];
