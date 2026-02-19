import type {
  Challenge,
  ClassName,
  ServerName,
  WeekContentCategory,
} from "@core/types/lostark";

export interface UpdateCharacterRequest {
  friendUsername?: string;
  characterId: number;
}

export interface UpdateCharacterNameRequest {
  friendUsername?: string;
  characterId: number;
  characterName: string;
}

export interface UpdateCharacterSettingRequest {
  friendUsername?: string;
  characterId: number;
  characterName: string;
  value: number | boolean;
  name: CharacterSettingName;
}

export interface UpdateChallengeRequest {
  serverName: ServerName;
  content: Challenge;
}

export interface Character {
  characterId: number;
  characterClassName: ClassName;
  characterImage: string;
  characterName: string;
  memo: string | null;
  itemLevel: number;
  combatPower: number; // 전투력 추가
  serverName: ServerName;
  sortNumber: number;
  chaos: DailyContentInformation;
  chaosCheck: number;
  chaosGauge: number;
  guardian: DailyContentInformation;
  guardianCheck: number;
  guardianGauge: number;
  guardianGold: number;
  goldCharacter: boolean;
  challengeGuardian: boolean;
  challengeAbyss: boolean;
  settings: Settings;
  weekGold: number;
  silmaelChange: boolean;
  cubeTicket: number;
  elysianCount: number;
  hellKey: number;
  weekDayTodoGold: number;
  weekRaidGold: number;
  weekCharacterRaidGold: number;
  todoList: TodoRaid[];
  beforeChaosGauge: number;
  beforeGuardianGauge: number;
}

export interface TodoRaid {
  id: number;
  name: string;
  characterClassName: ClassName;
  gold: number;
  check: boolean;
  message: string | null;
  currentGate: number;
  totalGate: number;
  weekCategory: string;
  weekContentCategory: WeekContentCategory;
  sortNumber: number;
  goldCheck: boolean;
  moreRewardCheckList: boolean[];
  realGold: number;
  characterGold: number;
}

export interface DailyContentInformation {
  id: number;
  category: string;
  name: string;
  level: number;
  shilling: number;
  honorShard: number;
  leapStone: number;
  destructionStone: number;
  guardianStone: number;
  jewelry: number;
}

export interface WeeklyRaid {
  id: number;
  weekCategory: string;
  weekContentCategory: WeekContentCategory;
  name: string;
  level: number;
  gate: number;
  gold: number;
  moreRewardCheck: boolean; // 더보기 체크
  busGold: number; // 버스 골드
  checked: boolean;
  coolTime: number;
  goldCheck: boolean;
  busGoldFixed: boolean;
  characterGold: number; // 캐릭터 귀속 골드
}

export interface Settings {
  goldCheckVersion: boolean; // true: 체크방식, false: 상위 3개
  goldCheckPolicyEnum: "RAID_CHECK_POLICY" | "TOP_THREE_POLICY";
  linkCubeCal: boolean; // 큐브 계산기와 연동 여부
  showCharacter: boolean; // 캐릭터 출력
  showChaos: boolean; // 일일 숙제 - 카오스 던전 출력
  showGuardian: boolean; // 일일 숙제 - 가디언 토벌 출력
  showWeekTodo: boolean; // 주간 레이드 출력
  showSilmaelChange: boolean; // 주간 숙제 - 실마엘 혈석 교환 출력
  showCubeTicket: boolean; // 주간 숙제 - 큐브 티켓 출력
  showElysian: boolean; // 주간 숙제 - 낙원 출력
  showMoreButton: boolean; // 주간 숙제 - 더보기 버튼 출력
  thresholdChaos: number; // 카오스 던전 임계값
  thresholdGuardian: number; // 가디언 토벌 임계값
}

export type CharacterSettingName = keyof Omit<
  Settings,
  "goldCheckVersion" | "goldCheckPolicyEnum"
>;
