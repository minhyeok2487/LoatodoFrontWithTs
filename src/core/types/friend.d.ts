import { CharacterType } from "./character";

export type FriendType = {
  friendId: number;
  friendUsername: string;
  areWeFriend: string;
  nickName: string;
  characterList: CharacterType[];
  toFriendSettings: FriendSettings;
  fromFriendSettings: FriendSettings;
};

export type FriendSettings = {
  showDayTodo: boolean;
  showRaid: boolean;
  showWeekTodo: boolean;
  checkDayTodo: boolean;
  checkRaid: boolean;
  checkWeekTodo: boolean;
  updateGauge: boolean;
  updateRaid: boolean;
  setting: boolean;
};
