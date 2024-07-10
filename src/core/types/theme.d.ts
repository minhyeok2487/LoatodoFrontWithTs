import type { Theme as MuiTheme } from "@mui/material";
import "styled-components";

import theme from "@core/theme";

declare module "styled-components" {
  export interface DefaultTheme extends MuiTheme {
    app: typeof theme.palette.light;
    medias: typeof theme.medias;
  }
}
