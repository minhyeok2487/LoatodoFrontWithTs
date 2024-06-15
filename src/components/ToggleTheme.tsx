import styled from "@emotion/styled";
import { useCallback } from "react";
import { useRecoilState } from "recoil";

import { themeMode } from "@core/atoms/Theme.atom";
import { ThemeEnums } from "@core/enum/ThemeEnum";

import IconDark from "@assets/images/ico_dark.png";

const ToggleTheme = (): JSX.Element => {
  const [theme, setTheme] = useRecoilState<ThemeEnums>(themeMode);
  const { LIGHT, DARK } = ThemeEnums;

  const handleChangeTheme = useCallback((): void => {
    if (theme === DARK) {
      localStorage.setItem("theme", LIGHT.toString());
      setTheme(LIGHT);
      return;
    }

    localStorage.setItem("theme", DARK.toString());
    setTheme(DARK);
  }, [DARK, LIGHT, setTheme, theme]);

  return (
    <>
      {
        // theme === LIGHT ? <FaMoon /> : <IoMdSunny />
        // 테마가 라이트모드 / 다크모드일때마다 아이콘을 다르게 렌더링 해줍니다.
        // 취향에 따라 아이콘을 설정해주세요 :)
      }
      <ThemeButton type="button" onClick={handleChangeTheme} />
    </>
  );
};

export default ToggleTheme;

const ThemeButton = styled.button`
  width: 40px;
  height: 40px;
  background: url(${IconDark}) no-repeat center / 100%;
  zoom: 60%;
`;
