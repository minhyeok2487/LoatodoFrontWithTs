export interface AddContentRequest {
  contentType: "day" | "week" | "cube";
  name: string;
  level: number;
  category: Category;
  shilling?: number;
  honorShard?: number;
  leapStone?: number;
  destructionStone?: number;
  guardianStone?: number;
  jewelry?: number;
  weekCategory?: string;
  weekContentCategory?: string;
  gate?: number;
  gold?: number;
  characterGold?: number;
  coolTime?: number;
  moreRewardGold?: number;
  solarGrace?: number;
  solarBlessing?: number;
  solarProtection?: number;
  cardExp?: number;
  lavasBreath?: number;
  glaciersBreath?: number;
}

export enum Category {
  카오스던전 = "카오스던전",
  가디언토벌 = "가디언토벌",
  군단장레이드 = "군단장레이드",
  어비스던전 = "어비스던전",
  어비스레이드 = "어비스레이드",
  에브니큐브 = "에브니큐브",
}

// WeekContentCategory는 BE API에서 동적으로 가져옴
// import useWeekContentCategories from "@core/hooks/queries/content/useWeekContentCategories";
