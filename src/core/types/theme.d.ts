import type { Theme as MuiTheme } from "@mui/material";
import "styled-components";

import medias from "@core/constants/medias";
import theme from "@core/constants/theme";

declare module "styled-components" {
  export interface DefaultTheme extends MuiTheme {
    app: typeof theme.light;
    medias: typeof medias;
  }
}
