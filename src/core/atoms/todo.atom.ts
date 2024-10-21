import { atom } from "jotai";

import { LOCAL_STORAGE_KEYS } from "@core/constants";
import type { ServerName } from "@core/types/lostark";

import atomWithImprovedStorage, {
  getItem,
} from "./utils/atomWithImprovedStorage";

// 캐릭터 서버 선택을 나타내는 Atom
export const todoServerAtom = atomWithImprovedStorage<
  ServerName | "전체" | null
>(
  LOCAL_STORAGE_KEYS.todoSelectedServer,
  getItem(LOCAL_STORAGE_KEYS.todoSelectedServer, null)
);

export const showSortFormAtom = atom(false);

export const isDialOpenAtom = atomWithImprovedStorage<boolean>(
  LOCAL_STORAGE_KEYS.isDialOpen,
  getItem(LOCAL_STORAGE_KEYS.isDialOpen, true)
);
