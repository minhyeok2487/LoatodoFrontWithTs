import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import styled from "styled-components";

import { showBackGroundAtom } from "@core/atoms/Blossom.atom";
import useIsBelowWidth from "@core/hooks/useIsBelowWidth";

const ToggleBackGround = () => {
  const [showBackGround, setShowBackGround] = useAtom(showBackGroundAtom);
  const isMobile = useIsBelowWidth(600);

  useEffect(() => {
    if (isMobile) {
      setShowBackGround(false);
    }
  }, [isMobile, setShowBackGround]);

  const handleChangeTheme = useCallback((): void => {
    setShowBackGround(!showBackGround);
  }, [setShowBackGround, showBackGround]);

  return (
    <>
      {!isMobile && (
        <>
          <span style={{ color: "white" }}>배경</span>
          <SwitchWrapper $isOn={showBackGround} onClick={handleChangeTheme}>
            <SwitchSlider $isOn={showBackGround} />
          </SwitchWrapper>
        </>
      )}
    </>
  );
};

export default ToggleBackGround;

const SwitchWrapper = styled.button<{ $isOn: boolean }>`
  width: 50px;
  height: 25px;
  background: ${({ $isOn }) => ($isOn ? "#4CAF50" : "#F44336")};
  border-radius: 50px;
  position: relative;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  padding: 2px;
  transition: background 0.3s ease-in-out;
`;

const SwitchSlider = styled.div<{ $isOn: boolean }>`
  width: 20px;
  height: 20px;
  background: ${({ theme }) => theme.app.bg.reverse};
  border-radius: 50%;
  position: absolute;
  left: ${({ $isOn }) => ($isOn ? "calc(100% - 22px)" : "3px")};
  transition: left 0.3s ease-in-out;
`;
