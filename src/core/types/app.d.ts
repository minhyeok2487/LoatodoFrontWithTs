import type {
  UndefinedInitialDataOptions,
  UseMutationOptions,
} from "@tanstack/react-query";

import type { CustomError, NoDataResponse } from "./api";

export type Theme = "light" | "dark";

export type PageGuardRules =
  | "ONLY_AUTH_USER" // 로그인 상태일 때만 접근 가능
  | "ONLY_GUEST" // 로그인 안한 유저만 접근 가능
  | "ONLY_CHARACTERS_REGISTERED_USER" // 캐릭터를 등록한 유저만 접근 가능
  | "ONLY_NO_CHARACTERS_USER"; // 캐릭터를 등록하지 않은 유저만 접근 가능

export type CommonUseQueryOptions<T> = Omit<
  UndefinedInitialDataOptions<T>,
  "queryKey" | "queryFn"
>;

export type CommonUseMutationOptions<
  P = void, // 파라미터가 있는 경우에 넣기, 없으면 void
  R = NoDataResponse, // onSuccess 콜백에서 data로 뭔가 하려는 경우에 response type 넣기
  E = CustomError, // CustomError 외의 에러 타입이 있다면 넣기
> = Omit<UseMutationOptions<R, E, P>, "mutationFn">;

export interface SortCharacterItem {
  characterName: string;
  sortNumber: number;
}

export type FormOptions<V> = Array<Record<"value", V> & { label: stirng }>;

export type ScheduleRaidNames =
  | "가디언 토벌"
  | "베히모스 노말"
  | "에키드나 하드"
  | "에키드나 노말"
  | "카멘 하드"
  | "카멘 노말"
  | "상아탑 하드"
  | "상아탑 노말"
  | "일리아칸 하드"
  | "일리아칸 노말"
  | "카양겔 노말"
  | "카양겔 하드"
  | "아브렐슈드 노말"
  | "아브렐슈드 하드"
  | "아브렐슈드 헬"
  | "쿠크세이튼 노말"
  | "쿠크세이튼 헬"
  | "비아키스 노말"
  | "비아키스 하드"
  | "비아키스 헬"
  | "발탄 노말"
  | "발탄 하드"
  | "발탄 헬"
  | "도전 가디언 토벌"
  | "도전 어비스 던전"
  | "길드 토벌전"
  | "큐브"
  | "트라이"
  | "트라이 선생님"
  | "기타(메모작성)";
