import { atom } from "recoil";

import type { ServerName } from "@core/types/lostark";

// 캐릭터 서버 선택을 나타내는 Atom
export const serverAtom = atom<ServerName | null>({
  key: "server",
  default: null,
});
