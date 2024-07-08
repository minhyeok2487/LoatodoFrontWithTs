import type { WeekRaidCategoryItem } from "@core/types/content";

import mainAxios from "./mainAxios";

export const getWeekRaidCategories = (): Promise<WeekRaidCategoryItem[]> => {
  return mainAxios
    .get("/v4/content/week/raid/category")
    .then((res) => res.data);
};
