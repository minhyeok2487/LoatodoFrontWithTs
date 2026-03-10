import palette from "@core/constants/palette";

type Theme = typeof light;

const light = {
  palette, // 정적인 색상 모음
  border: palette.gray[100], // e9e9e9
  bg: {
    main: "#f6f8fa",
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
};

const dark: Theme = {
  palette,
  border: palette.primer.border, // #30363d
  bg: {
    main: palette.primer.canvas, // #0d1117
    white: palette.primer.surface, // #161b22
    gray1: palette.primer.muted, // #21262d
    gray2: palette.primer.border, // #30363d
    reverse: palette.gray[200],
  },
  text: {
    main: palette.primer.fg, // #e6edf3
    black: palette.primer.fg, // #e6edf3
    dark1: palette.primer.fg, // #e6edf3
    dark2: palette.primer.fg, // #e6edf3
    light1: palette.primer.fgMuted, // #8b949e
    light2: palette.primer.fgSubtle, // #6e7681
    blue: palette.primer.accent, // #388bfd
    red: palette.primer.danger, // #f85149
    yellow: palette.primer.attention, // #d29922
    reverse: palette.gray[900], // 222222
    gray1: palette.primer.fgSubtle, // #6e7681
    purple: palette.primer.purple, // #bc8cff
  },
  gauge: {
    blue: palette.primer.accent, // #388bfd
    red: palette.primer.danger, // #f85149
  },
};

export default {
  light,
  dark,
};
