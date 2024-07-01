import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import { TEST_ACCESS_TOKEN } from "@core/constants";

export const authAtom = atomWithReset<{
  token: string;
  username: null | string;
}>({
  token: TEST_ACCESS_TOKEN,
  username: null,
});

export const authCheckedAtom = atom(false);
