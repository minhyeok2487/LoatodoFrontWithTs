import type { ThemeBase, ThemeState } from "@core/types/app";

export interface ThemeMeta {
  id: ThemeState;
  name: string;
  base: ThemeBase;
  preview: { bg: string; card: string; text: string; accent: string };
}

export const THEME_LIST: ThemeMeta[] = [
  {
    id: "light",
    name: "라이트",
    base: "light",
    preview: {
      bg: "#eff1f7",
      card: "#ffffff",
      text: "#444444",
      accent: "#2986ff",
    },
  },
  {
    id: "dark",
    name: "다크 1",
    base: "dark",
    preview: {
      bg: "#242424",
      card: "#414141",
      text: "#ffffff",
      accent: "#bbe4ff",
    },
  },
  {
    id: "dark2",
    name: "다크 2",
    base: "dark",
    preview: {
      bg: "#0d1117",
      card: "#161b22",
      text: "#e6edf3",
      accent: "#388bfd",
    },
  },
  {
    id: "mokoko",
    name: "모코코",
    base: "dark",
    preview: {
      bg: "#1a2e1a",
      card: "#2a3f2a",
      text: "#d4e8d4",
      accent: "#7bc67b",
    },
  },
  {
    id: "arcrassia",
    name: "아크라시아",
    base: "dark",
    preview: {
      bg: "#0d1b2a",
      card: "#1b2d45",
      text: "#c8d6e5",
      accent: "#5dade2",
    },
  },
  {
    id: "estella",
    name: "에스텔라",
    base: "light",
    preview: {
      bg: "#faf6f0",
      card: "#ffffff",
      text: "#5a4a3a",
      accent: "#c49a6c",
    },
  },
  {
    id: "solarized",
    name: "Solarized",
    base: "dark",
    preview: {
      bg: "#002b36",
      card: "#073642",
      text: "#839496",
      accent: "#268bd2",
    },
  },
  {
    id: "nord",
    name: "Nord",
    base: "dark",
    preview: {
      bg: "#2e3440",
      card: "#3b4252",
      text: "#d8dee9",
      accent: "#88c0d0",
    },
  },
];

export const getThemeMeta = (id: ThemeState): ThemeMeta => {
  return THEME_LIST.find((t) => t.id === id) || THEME_LIST[0];
};
