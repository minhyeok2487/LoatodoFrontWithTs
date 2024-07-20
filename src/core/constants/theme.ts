import palette from "@core/constants/palette";

type Theme = typeof light;

const staticColors = {
  // 테마가 변해도 그대로인 색상
  white: palette.gray[0],
  gray1: palette.gray[500],
  gray2: palette.gray[250],
  gray3: palette.gray[150],
  black: palette.gray[1000],
  semiBlack1: palette.gray[800],
  semiBlack2: palette.gray[550],
  semiBlack3: palette.gray[400],
  red: palette.red[250],
  blue1: palette.blue[350],
  blue2: palette.smokeBlue[500],
  blue3: palette.lightBlue[450],
  green: palette.smokeGreen[400],
  gold: palette.yellow[350],
  yellow: palette.yellow[300],
  pink1: palette.red[200],
  pink2: palette.red[0],
  sky1: palette.blue[0],
};

const light = {
  ...staticColors,
  palette,
  // 여기부터는 테마따라 바뀜
  border: palette.gray[100],
  bg: {
    main: palette.smokeBlue[0],
    light: palette.gray[0],
    gray1: palette.gray[50],
    gray2: palette.gray[150],
    reverse: palette.gray[700],
  },
  text: {
    main: palette.gray[700],
    black: palette.gray[1000],
    dark1: palette.gray[950],
    dark2: palette.gray[900],
    light1: palette.gray[550],
    light2: palette.gray[400],
    blue: palette.blue[450],
    red: palette.red[450],
    reverse: palette.gray[0],
  },
  label: {
    text1: palette.green[600],
    bg1: palette.green[50],
  },
  bar: {
    blue: palette.blue[50],
    red: palette.red[50],
  },
  rank: {
    text1: palette.smokeRed[300],
    text2: palette.yellow[200],
    text3: palette.green[350],
  },
};

const dark: Theme = {
  ...staticColors,
  palette,
  border: palette.gray[600],
  bg: {
    main: palette.gray[850],
    light: palette.gray[750],
    gray1: palette.gray[650],
    gray2: palette.gray[700],
    reverse: palette.gray[200],
  },
  text: {
    main: palette.gray[0],
    black: palette.gray[0],
    dark1: palette.gray[0],
    dark2: palette.gray[0],
    light1: palette.gray[400],
    light2: palette.gray[400],
    blue: palette.blue[50],
    red: palette.red[50],
    reverse: palette.gray[900],
  },
  label: {
    text1: palette.green[600],
    bg1: palette.green[50],
  },
  bar: {
    blue: palette.smokeBlue[200],
    red: palette.smokeRed[150],
  },
  rank: {
    text1: palette.smokeRed[300],
    text2: palette.yellow[200],
    text3: palette.green[350],
  },
};

export default {
  light,
  dark,
};
