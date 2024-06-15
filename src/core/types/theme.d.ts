import "@emotion/react";
import type { Theme as MuiTheme } from "@mui/material";

import theme from "@core/theme";

declare module "@emotion/react" {
  export interface Theme extends MuiTheme {
    app: typeof theme.palette.light;
    medias: typeof theme.medias;
  }
}
