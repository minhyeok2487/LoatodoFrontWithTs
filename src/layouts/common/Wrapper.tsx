import type { ReactNode } from "react";
import Ad from "src/module/Ad";
import styled from "styled-components";

import useIsBelowWidth from "@core/hooks/useIsBelowWidth";

interface Props {
  children: ReactNode;
}

const Wrapper = ({ children }: Props) => {
  const isMobile = useIsBelowWidth(900);

  return (
    <>
      {isMobile && (
        <MobileAdWrapper>
          <Ad placementName="mobile_banner" alias="default-mobile-banner" />
        </MobileAdWrapper>
      )}
      <Ad placementName="vertical_sticky" alias="default-vertical-sticky" />
      <ContentWrapper className="content-wrapper">
        <Ad placementName="desktop_takeover" alias="default-desktop-takeover" />
        {children}
      </ContentWrapper>
    </>
  );
};

export default Wrapper;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  padding: 20px 0;
  width: 100%;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
  color: ${({ theme }) => theme.app.text.dark1};

  ${({ theme }) => theme.medias.max1280} {
    padding: 20px 16px;
  }

  ${({ theme }) => theme.medias.max900} {
    margin-top: 0px;
    padding: 0 12px;
  }
`;

const MobileAdWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
