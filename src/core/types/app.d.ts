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
  Params = void, // 파라미터가 있는 경우에 넣기, 없으면 void
  Response = NoDataResponse, // onSuccess 콜백에서 data로 뭔가 하려는 경우에 response type 넣기
  Error = CustomError, // CustomError 외의 에러 타입이 있다면 넣기
> = Omit<UseMutationOptions<Response, Error, Params>, "mutationFn">;
