export interface MessageResponse {
  message: string;
  success: boolean;
}

export interface NoDataResponse {
  data: unknown;
  status: number;
}

export interface CustomError {
  errorCode: number;
  errorMessage: string;
  exceptionName: string;
}

// 캐릭터 업데이트 body의 캐릭터아이디를 characterId 또는 id로 받는 경우가 있어서 만듦 (characterId가 기본값)
type CharacterIdKeys = "characterId" | "id";

export type UpdateCharacterRequest<K extends CharacterIdKeys = "characterId"> =
  Record<K, number> & {
    characterName: string;
  };

export type UpdateDailyTodoCategory = "epona" | "chaos" | "guardian";

export type UpdateWeeklyTodoAction =
  | "UPDATE_WEEKLY_EPONA"
  | "UPDATE_WEEKLY_EPONA_ALL"
  | "TOGGLE_SILMAEL_EXCHANGE"
  | "SUBSCTRACT_CUBE_TICKET"
  | "ADD_CUBE_TICKET";
