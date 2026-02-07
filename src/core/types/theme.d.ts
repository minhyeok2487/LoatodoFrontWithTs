import type { Theme as MuiTheme } from "@mui/material";
import "styled-components";

import type medias from "@core/constants/medias";
import type theme from "@core/constants/theme";
import type { ThemeState } from "@core/types/app";

declare module "styled-components" {
  export interface DefaultTheme extends MuiTheme {
    currentTheme: ThemeState;
    app: typeof theme.light;
    medias: typeof medias;
  }
}
