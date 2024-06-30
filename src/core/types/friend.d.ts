import type {
  UpdateCharacterRequest,
  UpdateDailyTodoCategory,
} from "@core/types/api";
import type { SortCharacterItem } from "@core/types/app";
import type { Character } from "@core/types/character";

export interface GetAvaiableFriendWeeklyRaidsRequest {
  friendUsername: string;
  characterId: number;
}

export interface SaveFriendCharactersSortRequest {
  friendUserName: string;
  sortCharacters: SortCharacterItem[];
}

export interface HandleFriendRequest {
  fromUsername: string;
  action: HandleFriendRequestAction;
}

export interface UpdateFriendSettingRequest {
  id: number;
  name: keyof FriendSettings;
  value: boolean;
}

export interface UpdateFriendDailyTodoRequest extends UpdateCharacterRequest {
  category: UpdateDailyTodoCategory;
}

export interface UpdateFriendRestGaugeRequest extends UpdateCharacterRequest {
  chaosGauge: number;
  eponaGauge: number;
  guardianGauge: number;
}

export type UpdateFriendWeeklyRaidTodoRequest = UpdateCharacterRequest & {
  weekCategory: string;
} & (
    | {
        allCheck: false;
        currentGate: number;
        totalGatte: number;
      }
    | {
        allCheck: true;
      }
  );

export type UpdateFriendWeeklyTodoRequest = UpdateCharacterRequest<"id">;

export interface Friend {
  friendId: number;
  friendUsername: string;
  areWeFriend: AreWeFriend;
  nickName: string;
  characterList: Character[];
  toFriendSettings: FriendSettings;
  fromFriendSettings: FriendSettings;
}

export interface FriendSettings {
  showDayTodo: boolean;
  showRaid: boolean;
  showWeekTodo: boolean;
  checkDayTodo: boolean;
  checkRaid: boolean;
  checkWeekTodo: boolean;
  updateGauge: boolean;
  updateRaid: boolean;
  setting: boolean;
}

export interface SearchCharacterItem {
  id: number;
  areWeFriend: AreWeFriend;
  characterListSize: number;
  characterName: string;
  username: string;
}

export type AreWeFriend =
  | "깐부 요청" // 친구가 아닌 상태
  | "깐부" // 이미 친구임
  | "깐부 요청 진행중" // 내가 친구 요청을 보낸 상태
  | "깐부 요청 받음" // 나한테 친구 요청이 온 상태
  | "요청 거부"; // 내가 거부했거나 거부 당함

export type HandleFriendRequestAction = "ok" | "delete" | "reject";
