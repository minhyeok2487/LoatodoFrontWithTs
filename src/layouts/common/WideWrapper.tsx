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
      {!showWide && (
        <Ad placementName="vertical_sticky" alias="default-vertical-sticky" />
      )}
      <StyledWrapper $showWide={showWide}>
        <AdContainer>
          <Ad placementName="desktop_takeover" alias="default-desktop-takeover" />
        </AdContainer>
        <ContentContainer id="content-container">
          {children}
        </ContentContainer>
      </StyledWrapper>
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

  ${({ theme }) => theme.medias.max900} {
    padding: 10px 12px;
    margin: 0px auto 0;
  }
`;

const AdContainer = styled.div`
  margin-bottom: 10px;
`;

const ContentContainer = styled.div`
  background: ${({ theme }) => theme.app.bg.white};
  padding: 20px;
  border-radius: 8px;
`;