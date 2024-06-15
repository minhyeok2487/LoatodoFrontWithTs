import "@emotion/react";
import type { Theme as MuiTheme } from "@mui/material";

import type { Palette } from "@core/theme";

declare module "@emotion/react" {
  export interface Theme extends MuiTheme {
    custom: Palette;
  }
}
