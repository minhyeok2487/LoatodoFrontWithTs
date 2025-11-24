import type { FC } from "react";
import Ad from "src/module/Ad";
import styled from "styled-components";

import useMyInformation from "@core/hooks/queries/member/useMyInformation";
import useIsBelowWidth from "@core/hooks/useIsBelowWidth";
import useSeasonalEffect from "@core/hooks/useSeasonalEffect";

import Footer from "@components/Footer";
import GoogleAdvertise from "@components/GoogleAdvertise";
import SignUpCharactersNotify from "@components/SignUpCharactersNotify";

import Header from "./common/Header";
import WideWrapper from "./common/WideWrapper";

interface Props {
  pageTitle?: string;
  description?: string;
  children: React.ReactNode;
}

const WideDefaultLayout: FC<Props> = ({ pageTitle, description, children }) => {
  const getMyInformation = useMyInformation();
  const currentDateTime = new Date();
  const SeasonalEffect = useSeasonalEffect();
  const isMobile = useIsBelowWidth(900);

  return (
    <>
      <Header />
      {isMobile && (
        <Ad placementName="mobile_banner" alias="default-mobile-banner" />
      )}

      <WideWrapper>
        {SeasonalEffect && <SeasonalEffect />}
        {/* <EmergencyNotice /> */}

        <TitleRow>
          {pageTitle && <Title>{pageTitle}</Title>}

          {description && <Description>{description}</Description>}
        </TitleRow>

        <SignUpCharactersNotify />

        {children}
      </WideWrapper>

      {getMyInformation.data?.adsDate == null ||
      new Date(getMyInformation.data.adsDate) < currentDateTime ? (
        <GoogleAdvertise
          client="ca-pub-9665234618246720"
          slot="2191443590"
          format="auto"
          responsive="true"
        />
      ) : null}
      <Footer />
    </>
  );
};

export default WideDefaultLayout;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  width: 100%;

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  text-align: left;
  color: ${({ theme }) => theme.app.text.main};
`;

const Description = styled.p`
  padding: 5px 10px;
  background: ${({ theme }) => theme.app.bg.reverse};
  color: ${({ theme }) => theme.app.text.reverse};
  border-radius: 4px;
  font-size: 14px;
`;

const FloatingVideoAd = styled.div`
  position: fixed;
  right: 32px;
  bottom: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  border-radius: 8px;
  overflow: hidden;

  ${({ theme }) => theme.medias.max1280} {
    display: none;
  }
`;
