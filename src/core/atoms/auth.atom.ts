import { atom } from "recoil";

import { TEST_ACCESS_TOKEN } from "@core/constants";

export const authAtom = atom<{
  token: string;
  username: null | string;
}>({
  key: "auth",
  default: {
    token: TEST_ACCESS_TOKEN,
    username: null,
  },
});

export const authCheckedAtom = atom<boolean>({
  key: "authChecked",
  default: false,
});
