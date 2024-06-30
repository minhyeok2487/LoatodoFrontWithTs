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
  areWeFriend: string;
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
  areWeFriend: string;
  characterListSize: number;
  characterName: string;
  username: string;
}
