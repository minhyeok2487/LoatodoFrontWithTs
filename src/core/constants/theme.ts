import palette from "@core/constants/palette";

type Theme = typeof light;

const light = {
  palette, // 정적인 색상 모음
  border: palette.gray[100], // e9e9e9
  bg: {
    main: palette.smokeBlue[0],
    white: palette.gray[0], // ffffff
    gray1: palette.gray[50], // f0f0f0
    gray2: palette.gray[150], // dddddd
    reverse: palette.gray[700], // 444444
  },
  text: {
    black: palette.gray[1000], // 000000
    main: palette.gray[700], // 444444
    dark1: palette.gray[950], // 101010
    dark2: palette.gray[900], // 222222
    light1: palette.gray[550], // 666666
    light2: palette.gray[400], // 999999
    blue: palette.blue[450], // 8c8c8c
    red: palette.red[450], // ff0000
    yellow: palette.yellow[450], // f0ac0f
    reverse: palette.gray[0], // ffffff
    gray1: palette.gray[800], // 333333
    purple: palette.purple[450], // ff00ff
  },
  gauge: {
    blue: palette.blue[50],
    red: palette.red[50],
  },
  nav: {
    bg: palette.gray[800], // #333333
    bgHover: palette.gray[700], // #444444
    border: palette.gray[700], // #444444
    text: palette.gray[0], // #ffffff
    textMuted: palette.gray[400], // #999999
    textHover: palette.gray[100], // #e9e9e9
  },
};

const dark: Theme = {
  palette,
  border: palette.gray[600],
  bg: {
    main: palette.gray[850],
    white: palette.gray[750],
    gray1: palette.gray[650],
    gray2: palette.gray[700],
    reverse: palette.gray[200],
  },
  text: {
    main: palette.gray[0], // ffffff
    black: palette.gray[0], // ffffff
    dark1: palette.gray[0], // ffffff
    dark2: palette.gray[0], // ffffff
    light1: palette.gray[250], // c8c8c8
    light2: palette.gray[350], // a6a6a6
    blue: palette.blue[50],
    red: palette.red[50],
    yellow: palette.yellow[200],
    reverse: palette.gray[900], // 222222
    gray1: palette.gray[350], // a6a6a6
    purple: palette.purple[200], // D4AAFF - 밝은 보라색
  },
  gauge: {
    blue: palette.smokeBlue[200],
    red: palette.smokeRed[150],
  },
  nav: {
    bg: "#1a1a1a",
    bgHover: palette.gray[800],
    border: palette.gray[700],
    text: palette.gray[0],
    textMuted: palette.gray[400],
    textHover: palette.gray[100],
  },
};

const dark2: Theme = {
  palette,
  border: "#30363d",
  bg: {
    main: "#0d1117",
    white: "#161b22",
    gray1: "#21262d",
    gray2: "#30363d",
    reverse: palette.gray[200],
  },
  text: {
    main: "#e6edf3",
    black: "#e6edf3",
    dark1: "#e6edf3",
    dark2: "#e6edf3",
    light1: "#8b949e",
    light2: "#6e7681",
    blue: "#388bfd",
    red: "#f85149",
    yellow: "#d29922",
    reverse: palette.gray[900],
    gray1: "#6e7681",
    purple: "#bc8cff",
  },
  gauge: {
    blue: "#388bfd",
    red: "#f85149",
  },
  nav: {
    bg: "#010409",
    bgHover: "#161b22",
    border: "#21262d",
    text: "#e6edf3",
    textMuted: "#8b949e",
    textHover: "#f0f6fc",
  },
};

const mokoko: Theme = {
  palette,
  border: "#3a5a3a",
  bg: {
    main: "#1a2e1a",
    white: "#2a3f2a",
    gray1: "#345634",
    gray2: "#3a5a3a",
    reverse: "#c8e6c8",
  },
  text: {
    main: "#d4e8d4",
    black: "#e8f5e8",
    dark1: "#e8f5e8",
    dark2: "#e8f5e8",
    light1: "#a0c4a0",
    light2: "#80a880",
    blue: "#7bc67b",
    red: "#ff8d7e",
    yellow: "#f7d681",
    reverse: "#1a2e1a",
    gray1: "#a0c4a0",
    purple: "#D4AAFF",
  },
  gauge: {
    blue: "#5a9e5a",
    red: "#c46050",
  },
  nav: {
    bg: "#0f1f0f",
    bgHover: "#1a2e1a",
    border: "#2a3f2a",
    text: "#d4e8d4",
    textMuted: "#80a880",
    textHover: "#e8f5e8",
  },
};

const arcrassia: Theme = {
  palette,
  border: "#2a4060",
  bg: {
    main: "#0d1b2a",
    white: "#1b2d45",
    gray1: "#243b55",
    gray2: "#2a4060",
    reverse: "#c8d6e5",
  },
  text: {
    main: "#c8d6e5",
    black: "#e0eaf5",
    dark1: "#e0eaf5",
    dark2: "#e0eaf5",
    light1: "#8da4bf",
    light2: "#6b8aad",
    blue: "#5dade2",
    red: "#ff8d7e",
    yellow: "#f7d681",
    reverse: "#0d1b2a",
    gray1: "#8da4bf",
    purple: "#D4AAFF",
  },
  gauge: {
    blue: "#3a7ec0",
    red: "#c46050",
  },
  nav: {
    bg: "#06101a",
    bgHover: "#0d1b2a",
    border: "#1b2d45",
    text: "#c8d6e5",
    textMuted: "#6b8aad",
    textHover: "#e0eaf5",
  },
};

const estella: Theme = {
  palette,
  border: "#e0d5c5",
  bg: {
    main: "#faf6f0",
    white: "#ffffff",
    gray1: "#f0e8dc",
    gray2: "#e0d5c5",
    reverse: "#5a4a3a",
  },
  text: {
    main: "#5a4a3a",
    black: "#3a2e22",
    dark1: "#3a2e22",
    dark2: "#4a3e30",
    light1: "#8a7a68",
    light2: "#a09080",
    blue: "#7a6050",
    red: "#c05040",
    yellow: "#c49a6c",
    reverse: "#faf6f0",
    gray1: "#6a5a4a",
    purple: "#b08ac0",
  },
  gauge: {
    blue: "#c4a882",
    red: "#d09080",
  },
  nav: {
    bg: "#4a3e30",
    bgHover: "#5a4a3a",
    border: "#6a5a4a",
    text: "#faf6f0",
    textMuted: "#c4b09a",
    textHover: "#ffffff",
  },
};

const solarized: Theme = {
  palette,
  border: "#1a4050",
  bg: {
    main: "#002b36",
    white: "#073642",
    gray1: "#0a4050",
    gray2: "#1a4050",
    reverse: "#eee8d5",
  },
  text: {
    main: "#839496",
    black: "#fdf6e3",
    dark1: "#fdf6e3",
    dark2: "#eee8d5",
    light1: "#657b83",
    light2: "#586e75",
    blue: "#268bd2",
    red: "#dc322f",
    yellow: "#b58900",
    reverse: "#002b36",
    gray1: "#657b83",
    purple: "#d33682",
  },
  gauge: {
    blue: "#268bd2",
    red: "#dc322f",
  },
  nav: {
    bg: "#001e28",
    bgHover: "#002b36",
    border: "#073642",
    text: "#93a1a1",
    textMuted: "#586e75",
    textHover: "#fdf6e3",
  },
};

const nord: Theme = {
  palette,
  border: "#434c5e",
  bg: {
    main: "#2e3440",
    white: "#3b4252",
    gray1: "#434c5e",
    gray2: "#4c566a",
    reverse: "#d8dee9",
  },
  text: {
    main: "#d8dee9",
    black: "#eceff4",
    dark1: "#eceff4",
    dark2: "#e5e9f0",
    light1: "#9ea8ba",
    light2: "#7b859b",
    blue: "#88c0d0",
    red: "#bf616a",
    yellow: "#ebcb8b",
    reverse: "#2e3440",
    gray1: "#9ea8ba",
    purple: "#b48ead",
  },
  gauge: {
    blue: "#5e81ac",
    red: "#bf616a",
  },
  nav: {
    bg: "#242933",
    bgHover: "#2e3440",
    border: "#3b4252",
    text: "#d8dee9",
    textMuted: "#7b859b",
    textHover: "#eceff4",
  },
};

const themes: Record<string, Theme> = {
  light,
  dark,
  dark2,
  mokoko,
  arcrassia,
  estella,
  solarized,
  nord,
};

export default themes;
