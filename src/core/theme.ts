type Palette = typeof light;

const light = {
  // 테마가 변해도 그대로인 색상
  white: "#fff",
  gray1: "#808080",
  gray2: "#c8c8c8",
  gray3: "#ddd",
  black: "#000",
  semiBlack1: "#333",
  semiBlack2: "#666",
  semiBlack3: "#999",
  red: "#ff5a5a",
  blue1: "#2986ff",
  blue2: "#2c79bd",
  blue3: "#1ddfee",
  green: "#73a982",
  gold: "#ecb22e",
  yellow: "#ffc74f",
  pink1: "#ff8d7e",
  pink2: "#ffe2e2",
  sky1: "#e2f0ff",
  // 여기부터는 테마따라 바뀜
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
    blue: "#001dff",
    red: "#ff0000",
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
  gray3: "#ddd",
  black: "#000",
  semiBlack1: "#333",
  semiBlack2: "#666",
  semiBlack3: "#999",
  red: "#ff0000",
  blue1: "#2986ff",
  blue2: "#2c79bd",
  blue3: "#1ddfee",
  green: "#73a982",
  gold: "#ecb22e",
  yellow: "#ffc74f",
  pink1: "#ff8d7e",
  pink2: "#ffe2e2",
  sky1: "#e2f0ff",
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
    blue: "#bbe4ff",
    red: "#ffd8d2",
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
    max800: "@media (max-width: 800px)",
    max700: "@media (max-width: 700px)",
    max600: "@media (max-width: 600px)",
    max500: "@media (max-width: 500px)",
    max400: "@media (max-width: 400px)",
    max300: "@media (max-width: 300px)",
  },
};
