type Palette = typeof light;

const light = {
  white: "#fff",
  semiBlack: "#333",
  border: "#e9e9e9",
  bg: {
    main: "#eff1f7",
    light: "#fff",
    reverse: "#444",
    representCharacter: "#333",
  },
  text: {
    main: "#444",
    dark1: "#101010",
    dark2: "#222",
    light1: "#666",
    light2: "#999",
    reverse: "#fff",
    representCharacter: "#999",
  },
  bar: {
    blue: "#bbe4ff",
    red: "#ffd8d2",
  },
};

const dark: Palette = {
  white: "#fff",
  semiBlack: "#333",
  border: "#5b5b5b",
  bg: {
    main: "#242424",
    light: "#414141",
    reverse: "#d7d7d7",
    representCharacter: "#333",
  },
  text: {
    main: "#444",
    dark1: "#fff",
    dark2: "#fff",
    light1: "#999",
    light2: "#999",
    reverse: "#222",
    representCharacter: "#999",
  },
  bar: {
    blue: "#abc1cf",
    red: "#e9b4ac",
  },
};

export default {
  palette: {
    light,
    dark,
  },
  medias: {
    max900: "@media (max-width: 900px)",
    max576: "@media (max-width: 576px)",
    max500: "@media (max-width: 500px)",
  },
};
