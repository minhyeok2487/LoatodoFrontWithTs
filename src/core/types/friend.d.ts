import { SortCharacterItem } from "./app";
import { Character } from "./character";

export interface GetFriendWeeklyRaidsRequest {
  friendUsername: string;
  characterId: number;
}

export interface SaveFriendCharactersSortRequest {
  friendUserName: string;
  sortCharacters: SortCharacterItem[];
}

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
