import { WeekContentCategory } from "@core/types/lostark";

export interface WeekRaidCategoryItem {
  categoryId: number;
  name: string;
  weekContentCategory: WeekContentCategory;
  level: number;
}
