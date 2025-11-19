import type { ReactNode } from "react";
import Ad from "src/module/Ad";
import styled from "styled-components";

interface Props {
  children: ReactNode;
}

const Wrapper = ({ children }: Props) => {
  return (
    <>
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

  ${({ theme }) => theme.medias.max600} {
    padding: 10px 12px;
  }
`;
