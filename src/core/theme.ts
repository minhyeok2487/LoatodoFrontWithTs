type Palette = typeof light;

const light = {
  white: "#fff",
  gray1: "#808080",
  gray2: "#c8c8c8",
  black: "#000",
  semiBlack1: "#333",
  semiBlack2: "#666",
  semiBlack3: "#999",
  red: "#ff5a5a",
  blue: "#2986ff",
  green: "#73a982",
  gold: "#ecb22e",
  border: "#e9e9e9",
  bg: {
    main: "#eff1f7",
    light: "#fff",
    gray1: "#f0f0f0",
    reverse: "#444",
  },
  text: {
    main: "#444",
    black: "#000",
    dark1: "#101010",
    dark2: "#222",
    light1: "#666",
    light2: "#999",
    reverse: "#fff",
  },
  label: {
    text1: "#00b62d",
    bg1: "#e4f5d7",
  },
  bar: {
    blue: "#bbe4ff",
    red: "#ffd8d2",
  },
  rank: {
    text1: "#e96161",
    text2: "#f7d681",
    text3: "#94e35d",
  },
};

const dark: Palette = {
  white: "#fff",
  gray1: "#808080",
  gray2: "#c8c8c8",
  black: "#000",
  semiBlack1: "#333",
  semiBlack2: "#666",
  semiBlack3: "#999",
  red: "#ff5a5a",
  blue: "#2986ff",
  green: "#73a982",
  gold: "#ecb22e",
  border: "#5b5b5b",
  bg: {
    main: "#242424",
    light: "#414141",
    gray1: "#595959",
    reverse: "#d7d7d7",
  },
  text: {
    main: "#fff",
    black: "#fff",
    dark1: "#fff",
    dark2: "#fff",
    light1: "#999",
    light2: "#999",
    reverse: "#222",
  },
  label: {
    text1: "#00b62d",
    bg1: "#e4f5d7",
  },
  bar: {
    blue: "#abc1cf",
    red: "#e9b4ac",
  },
  rank: {
    text1: "#e96161",
    text2: "#f7d681",
    text3: "#94e35d",
  },
};

export default {
  palette: {
    light,
    dark,
  },
  medias: {
    max1280: "@media (max-width: 1280px)",
    max900: "@media (max-width: 900px)",
    max576: "@media (max-width: 576px)",
    max500: "@media (max-width: 500px)",
  },
};
