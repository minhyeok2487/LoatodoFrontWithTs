import { IoColorPaletteOutline } from "@react-icons/all-files/io5/IoColorPaletteOutline";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { themeAtom } from "@core/atoms/theme.atom";
import { THEME_LIST } from "@core/constants/themeRegistry";
import type { ThemeState } from "@core/types/app";

const ToggleTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    if (open) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (id: ThemeState) => {
      setTheme(id);
      setOpen(false);
    },
    [setTheme]
  );

  const handleBackdropClick = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Wrapper>
      <ThemeButton type="button" onClick={handleToggle}>
        <IoColorPaletteOutline />
      </ThemeButton>

      {open && (
        <>
          <Backdrop onClick={handleBackdropClick} />
          <Popover>
            <PopoverTitle>테마 선택</PopoverTitle>
            <ThemeGrid>
              {THEME_LIST.map((meta) => (
                <ThemeCard
                  key={meta.id}
                  $selected={theme === meta.id}
                  onClick={() => handleSelect(meta.id)}
                >
                  <PreviewBlock>
                    <PreviewBg $color={meta.preview.bg}>
                      <PreviewCard $color={meta.preview.card}>
                        <PreviewText $color={meta.preview.text}>Aa</PreviewText>
                        <PreviewAccent $color={meta.preview.accent} />
                      </PreviewCard>
                    </PreviewBg>
                  </PreviewBlock>
                  <ThemeName>
                    {theme === meta.id && <CheckMark>✓</CheckMark>}
                    {meta.name}
                  </ThemeName>
                </ThemeCard>
              ))}
            </ThemeGrid>
          </Popover>
        </>
      )}
    </Wrapper>
  );
};

export default ToggleTheme;

const Wrapper = styled.div`
  position: relative;
`;

const ThemeButton = styled.button`
  padding: 5px;
  color: ${({ theme }) => theme.app.nav.text};
  font-size: 24px;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

const Popover = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  margin-top: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  min-width: 280px;
`;

const PopoverTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
  margin-bottom: 12px;
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
`;

const ThemeCard = styled.div<{ $selected: boolean }>`
  cursor: pointer;
  border-radius: 8px;
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.app.text.blue : theme.app.border};
  overflow: hidden;
  transition: border-color 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.app.text.light2};
  }
`;

const PreviewBlock = styled.div`
  padding: 6px;
`;

const PreviewBg = styled.div<{ $color: string }>`
  background: ${({ $color }) => $color};
  border-radius: 4px;
  padding: 8px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewCard = styled.div<{ $color: string }>`
  background: ${({ $color }) => $color};
  border-radius: 4px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
`;

const PreviewText = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-size: 14px;
  font-weight: 600;
`;

const PreviewAccent = styled.div<{ $color: string }>`
  width: 16px;
  height: 8px;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  margin-left: auto;
`;

const ThemeName = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.main};
  text-align: center;
  justify-content: center;
`;

const CheckMark = styled.span`
  color: ${({ theme }) => theme.app.text.blue};
  font-weight: 700;
`;
