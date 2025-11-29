import type { FC } from "react";
import styled from "styled-components";

import useSeasonalEffect from "@core/hooks/useSeasonalEffect";

import Footer from "@components/Footer";
import SignUpCharactersNotify from "@components/SignUpCharactersNotify";

import Header from "./common/Header";
import WideWrapper from "./common/WideWrapper";

interface Props {
  pageTitle?: string;
  description?: string;
  children: React.ReactNode;
}

const WideDefaultLayout: FC<Props> = ({ pageTitle, description, children }) => {
  const SeasonalEffect = useSeasonalEffect();

  return (
    <>
      <Header />

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
