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
  weekContentCategory?: WeekContentCategory;
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
  일일에포나 = "일일에포나",
  군단장레이드 = "군단장레이드",
  어비스던전 = "어비스던전",
  어비스레이드 = "어비스레이드",
  에브니큐브 = "에브니큐브",
}

export enum WeekContentCategory {
  노말 = "노말",
  하드 = "하드",
  싱글 = "싱글",
  나이트메어 = "나이트메어",
}
