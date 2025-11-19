import { useAtom } from "jotai";
import type { ReactNode } from "react";
import Ad from "src/module/Ad";
import styled from "styled-components";

import { showWideAtom } from "@core/atoms/todo.atom";

interface Props {
  children: ReactNode;
}

const WideWrapper = ({ children }: Props) => {
  const [showWide, setShowWide] = useAtom(showWideAtom);

  return (
    <>
      <StyledWrapper $showWide={showWide}>
        <Ad placementName="desktop_takeover" alias="default-desktop-takeover" />
        {children}
      </StyledWrapper>
      <AdContainer />
    </>
  );
};

export default WideWrapper;

const StyledWrapper = styled.div<{ $showWide: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 60px auto 0;
  padding: 20px 0;
  width: 100%;
  max-width: ${({ $showWide }) => ($showWide ? "1880px" : "1280px")};
  height: 100%;
  color: ${({ theme }) => theme.app.text.dark1};

  ${({ theme }) => theme.medias.max1800} {
    padding: 20px 16px;
  }

  ${({ theme }) => theme.medias.max1280} {
    padding: 20px 16px;
  }

  ${({ theme }) => theme.medias.max600} {
    padding: 10px 12px;
  }
`;

const AdContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 90px;
  max-width: 1080px;
  margin: 0 auto;
  margin-top: 25px;
  margin-bottom: 25px;
  position: relative;
`;
