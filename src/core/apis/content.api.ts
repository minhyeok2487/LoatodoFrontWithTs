import type {
  WeekContentCategoryMeta,
  WeekRaidCategoryItem,
} from "@core/types/content";

import mainAxios from "./mainAxios";

export const getWeekRaidCategories = (): Promise<WeekRaidCategoryItem[]> => {
  return mainAxios
    .get("/api/v1/schedule/raid/category")
    .then((res) => res.data);
};

export const getWeekContentCategories = (): Promise<
  WeekContentCategoryMeta[]
> => {
  return mainAxios
    .get("/api/v1/content/week/categories")
    .then((res) => res.data);
};
