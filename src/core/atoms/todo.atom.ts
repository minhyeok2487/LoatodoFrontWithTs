import { atom } from "jotai";

import { LOCAL_STORAGE_KEYS } from "@core/constants";
import type { ServerName } from "@core/types/lostark";

import atomWithImprovedStorage, {
  getItem,
} from "./utils/atomWithImprovedStorage";

// 캐릭터 서버 선택을 나타내는 Atom
export const todoServerAtom = atomWithImprovedStorage<ServerName | "전체">(
  LOCAL_STORAGE_KEYS.todoServer,
  getItem(LOCAL_STORAGE_KEYS.todoServer, "전체")
);

export const showSortFormAtom = atom(false);

export const showGridFormAtom = atom(false);

export const showDailyTodoSortFormAtom = atom(false);

export const isDialOpenAtom = atomWithImprovedStorage<boolean>(
  LOCAL_STORAGE_KEYS.isDialOpen,
  getItem(LOCAL_STORAGE_KEYS.isDialOpen, true)
);

// export const showWideAtom = atom(false);
export const showWideAtom = atomWithImprovedStorage<boolean>(
  LOCAL_STORAGE_KEYS.showWideAtom,
  getItem(LOCAL_STORAGE_KEYS.showWideAtom, false)
)

export const showLoaCalendar = atomWithImprovedStorage<boolean>(
  LOCAL_STORAGE_KEYS.showLoaCalendar,
  getItem(LOCAL_STORAGE_KEYS.showLoaCalendar, true)
)