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
    purple: palette.purple[450], // 990099
  },
  gauge: {
    blue: palette.smokeBlue[200],
    red: palette.smokeRed[150],
  },
};

export default {
  light,
  dark,
};
