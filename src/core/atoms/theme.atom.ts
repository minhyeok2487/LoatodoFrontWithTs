import { LOCAL_STORAGE_KEYS } from "@core/constants";
import type { Theme } from "@core/types/app";

import atomWithImprovedStorage from "./utils/atomWithImprovedStorage";

export const themeAtom = atomWithImprovedStorage<Theme>(
  LOCAL_STORAGE_KEYS.theme,
  "light"
);
