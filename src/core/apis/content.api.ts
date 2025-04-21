import type { WeekRaidCategoryItem } from "@core/types/content";

import mainAxios from "./mainAxios";

export const getWeekRaidCategories = (): Promise<WeekRaidCategoryItem[]> => {
  return mainAxios
    .get("/api/v1/schedule/raid/category")
    .then((res) => res.data);
};
