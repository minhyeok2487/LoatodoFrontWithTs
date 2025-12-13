import type { FC } from "react";
import { useAtomValue } from "jotai";
import Ad from "src/module/Ad";
import styled from "styled-components";

import { authAtom } from "@core/atoms/auth.atom";
import useIsBelowWidth from "@core/hooks/useIsBelowWidth";
import useSeasonalEffect from "@core/hooks/useSeasonalEffect";

import Footer from "@components/Footer";
import SignUpCharactersNotify from "@components/SignUpCharactersNotify";

import Header from "./common/Header";
import Wrapper from "./common/Wrapper";

interface Props {
  pageTitle?: string;
  description?: string;
  children: React.ReactNode;
}

const DefaultLayout: FC<Props> = ({ pageTitle, description, children }) => {
  const SeasonalEffect = useSeasonalEffect();
  const isMobile = useIsBelowWidth(900);
  const auth = useAtomValue(authAtom);

  const shouldShowAd = !auth.adsDate || new Date(auth.adsDate) <= new Date();

  return (
    <>
      <Header />

      <Wrapper>
        {SeasonalEffect && <SeasonalEffect />}

        {/* <TitleRow>
          {pageTitle && <Title>{pageTitle}</Title>}
          {description && <Description>{description}</Description>}
        </TitleRow> */}

        <SignUpCharactersNotify />
        {isMobile && shouldShowAd && (
          <MobileAdWrapper>
            <Ad placementName="mobile_banner" alias="default-mobile-banner" />
          </MobileAdWrapper>
        )}
        {children}
      </Wrapper>

      <Footer />
    </>
  );
};

export default DefaultLayout;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  width: 100%;
  position: relative;
  z-index: 2;

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

const MobileAdWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
