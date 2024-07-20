import { IoMoonOutline } from "@react-icons/all-files/io5/IoMoonOutline";
import { IoSunnyOutline } from "@react-icons/all-files/io5/IoSunnyOutline";
import { useAtom } from "jotai";
import { useCallback } from "react";
import styled from "styled-components";

import { themeAtom } from "@core/atoms/theme.atom";

const ToggleTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const handleChangeTheme = useCallback((): void => {
    const newTheme = theme === "dark" ? "light" : "dark";

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
  color: ${({ theme }) => theme.app.palette.gray[0]};
  font-size: 24px;
`;
