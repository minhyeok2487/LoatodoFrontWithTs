import styled from "@emotion/styled";
import { useCallback } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";

import { themeAtom } from "@core/atoms/theme.atom";
import { Theme } from "@core/types/app";

const ToggleTheme = (): JSX.Element => {
  const [theme, setTheme] = useRecoilState<Theme>(themeAtom);

  const handleChangeTheme = useCallback((): void => {
    const newTheme = theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  }, [setTheme, theme]);

  return (
    <ThemeButton type="button" onClick={handleChangeTheme}>
      {theme === "dark" ? <IoSunnyOutline /> : <IoMoonOutline />}
    </ThemeButton>
  );
};

export default ToggleTheme;

const ThemeButton = styled.button`
  padding: 5px;
  color: ${({ theme }) => theme.app.white};
  font-size: 24px;

  svg {
    stroke-width: 5;
  }
`;
