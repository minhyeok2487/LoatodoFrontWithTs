// 공통 페이징 응답
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Role 타입
export type MemberRole = "USER" | "ADMIN" | "PUBLISHER";

// Auth Provider 타입
export type AuthProvider = "google" | "none";

// ==================== Member ====================
export interface AdminMember {
  memberId: number;
  username: string;
  createdDate: string;
  authProvider: AuthProvider;
  mainCharacter: string | null;
  apiKey: string | null;
}

export interface AdminMemberCharacter {
  characterId: number;
  characterName: string;
  serverName: string;
  itemLevel: number;
  characterClassName: string;
}

export interface AdminMemberDetail extends AdminMember {
  role: MemberRole;
  adsDate: string | null;
  characters: AdminMemberCharacter[];
}

export interface AdminMemberUpdateRequest {
  role?: MemberRole;
  mainCharacter?: string;
  adsDate?: string;
}

export interface AdminMemberListParams {
  username?: string;
  authProvider?: AuthProvider;
  mainCharacter?: string;
  page?: number;
  limit?: number;
}

// ==================== Character ====================
export interface AdminCharacter {
  characterId: number;
  memberId: number;
  memberUsername: string;
  serverName: string;
  characterName: string;
  characterLevel: number;
  characterClassName: string;
  characterImage: string;
  itemLevel: number;
  sortNumber: number;
  goldCharacter: boolean;
  isDeleted: boolean;
  createdDate: string;
}

export interface AdminCharacterDayTodo {
  chaosCheck: number;
  chaosGauge: number;
  guardianCheck: number;
  guardianGauge: number;
  eponaCheck: number;
  eponaGauge: number;
}

export interface AdminCharacterWeekTodo {
  weekEpona: number;
  silmaelChange: boolean;
  cubeTicket: number;
}

export interface AdminCharacterSettings {
  showCharacter: boolean;
  showChaos: boolean;
  showGuardian: boolean;
}

export interface AdminCharacterDetail extends AdminCharacter {
  combatPower: number;
  memo: string;
  challengeGuardian: boolean;
  challengeAbyss: boolean;
  dayTodo: AdminCharacterDayTodo;
  weekTodo: AdminCharacterWeekTodo;
  settings: AdminCharacterSettings;
}

export interface AdminCharacterUpdateRequest {
  characterName?: string;
  itemLevel?: number;
  sortNumber?: number;
  memo?: string;
  goldCharacter?: boolean;
  isDeleted?: boolean;
}

export interface AdminCharacterListParams {
  memberId?: number;
  serverName?: string;
  characterName?: string;
  characterClassName?: string;
  minItemLevel?: number;
  maxItemLevel?: number;
  isDeleted?: boolean;
  page?: number;
  limit?: number;
}

// ==================== Content ====================
export type ContentType = "day" | "week" | "cube";

export type ContentCategory =
  | "카오스던전"
  | "가디언토벌"
  | "일일에포나"
  | "군단장레이드"
  | "어비스던전"
  | "어비스레이드"
  | "에브니큐브";

export type WeekContentCategory = "노말" | "하드" | "싱글" | "나이트메어";

export interface AdminContentBase {
  id: number;
  contentType: ContentType;
  name: string;
  level: number;
  category: ContentCategory;
}

export interface AdminDayContent extends AdminContentBase {
  contentType: "day";
  shilling?: number;
  honorShard?: number;
  leapStone?: number;
  destructionStone?: number;
  guardianStone?: number;
  jewelry?: number;
}

export interface AdminWeekContent extends AdminContentBase {
  contentType: "week";
  weekCategory: string;
  weekContentCategory: WeekContentCategory;
  gate: number;
  gold?: number;
  characterGold?: number;
  coolTime?: number;
  moreRewardGold?: number;
}

export interface AdminCubeContent extends AdminContentBase {
  contentType: "cube";
  jewelry?: number;
  leapStone?: number;
  shilling?: number;
  solarGrace?: number;
  solarBlessing?: number;
  solarProtection?: number;
  cardExp?: number;
  lavasBreath?: number;
  glaciersBreath?: number;
}

export type AdminContent = AdminDayContent | AdminWeekContent | AdminCubeContent;

export interface AdminContentListParams {
  contentType?: ContentType;
  category?: ContentCategory;
  name?: string;
  minLevel?: number;
  maxLevel?: number;
  page?: number;
  limit?: number;
}

export interface AdminDayContentCreateRequest {
  contentType: "day";
  name: string;
  level: number;
  category: ContentCategory;
  shilling?: number;
  honorShard?: number;
  leapStone?: number;
  destructionStone?: number;
  guardianStone?: number;
  jewelry?: number;
}

export interface AdminWeekContentCreateRequest {
  contentType: "week";
  name: string;
  level: number;
  category: ContentCategory;
  weekCategory: string;
  weekContentCategory: WeekContentCategory;
  gate: number;
  gold?: number;
  characterGold?: number;
  coolTime?: number;
  moreRewardGold?: number;
}

export interface AdminCubeContentCreateRequest {
  contentType: "cube";
  name: string;
  level: number;
  category: ContentCategory;
  jewelry?: number;
  leapStone?: number;
  shilling?: number;
  solarGrace?: number;
  solarBlessing?: number;
  solarProtection?: number;
  cardExp?: number;
  lavasBreath?: number;
  glaciersBreath?: number;
}

export type AdminContentCreateRequest =
  | AdminDayContentCreateRequest
  | AdminWeekContentCreateRequest
  | AdminCubeContentCreateRequest;

// ==================== Dashboard ====================
export interface DailyStats {
  date: string;
  count: number;
}

export interface DashboardSummary {
  totalMembers: number;
  totalCharacters: number;
  todayNewMembers: number;
  todayNewCharacters: number;
  activeMembers: number;
}

// ==================== Comments ====================
export interface AdminComment {
  commentId: number;
  memberId: number;
  memberUsername: string;
  body: string;
  parentId: number | null;
  createdDate: string;
}

export interface AdminCommentListParams {
  memberId?: number;
  body?: string;
  page?: number;
  limit?: number;
}

// ==================== Friends ====================
export interface AdminFriend {
  friendId: number;
  memberId: number;
  memberUsername: string;
  friendUsername: string;
  areWeFriend: boolean;
  createdDate: string;
}

export interface AdminFriendListParams {
  memberId?: number;
  page?: number;
  limit?: number;
}

// ==================== Notifications ====================
export interface AdminNotification {
  notificationId: number;
  receiverId: number;
  receiverUsername: string;
  content: string;
  isRead: boolean;
  createdDate: string;
}

export interface AdminNotificationListParams {
  memberId?: number;
  isRead?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminBroadcastRequest {
  content: string;
}

export interface AdminBroadcastResponse {
  message: string;
  sentCount: number;
}
