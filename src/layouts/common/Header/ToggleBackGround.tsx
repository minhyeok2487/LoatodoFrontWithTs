import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { showBackGroundAtom } from "@core/atoms/Blossom.atom";

const ToggleBackGround = () => {
  const [showBackGround, setShowBackGround] = useAtom(showBackGroundAtom);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
