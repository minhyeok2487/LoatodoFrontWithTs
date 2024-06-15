import styled from "@emotion/styled";
import { useCallback } from "react";
import { useRecoilState } from "recoil";

import { themeAtom } from "@core/atoms/Theme.atom";
import { Theme } from "@core/types/app";

import IconDark from "@assets/images/ico_dark.png";

const ToggleTheme = (): JSX.Element => {
  const [theme, setTheme] = useRecoilState<Theme>(themeAtom);

  const handleChangeTheme = useCallback((): void => {
    const newTheme = theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  }, [setTheme, theme]);

  return <ThemeButton type="button" onClick={handleChangeTheme} />;
};

export default ToggleTheme;

const ThemeButton = styled.button`
  width: 24px;
  height: 24px;
  background: url(${IconDark}) no-repeat center / contain;
`;
