import { atom } from "recoil";

import type { Theme } from "@core/types/app";

const getTheme = (): Theme => {
  const theme: string = localStorage.getItem("theme") || "light";

  return theme === "dark" ? "dark" : "light";
};

export const themeAtom = atom<Theme>({
  key: "theme",
  default: getTheme(),
});
