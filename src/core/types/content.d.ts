import { WeekContentCategory } from "@core/types/lostark";

export interface WeekRaidCategoryItem {
  categoryId: number;
  name: string;
  weekContentCategory: WeekContentCategory;
  level: number;
}

export interface WeekContentCategoryMeta {
  name: string;
  displayName: string;
  sortOrder: number;
  color: string;
}
