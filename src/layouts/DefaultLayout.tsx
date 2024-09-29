import { useState } from "react";
import type { FC } from "react";
import styled from "styled-components";

import GoogleAdvertise from "@components/GoogleAdvertise";
import SignUpCharactersNotify from "@components/SignUpCharactersNotify";

import Header from "./common/Header";
import Wrapper from "./common/Wrapper";

interface Props {
  pageTitle?: string;
  description?: string;
  children: React.ReactNode;
}

const DefaultLayout: FC<Props> = ({ pageTitle, description, children }) => {
  const [randomNumber] = useState(Math.random() < 0.5 ? 0 : 1);

  return (
    <>
      <Header />

      <Wrapper>
        {/* <EmergencyNotice /> */}

        <TitleRow>
          {pageTitle && <Title>{pageTitle}</Title>}

          {description && <Description>{description}</Description>}
        </TitleRow>

        <SignUpCharactersNotify />

        {children}

        {randomNumber === 1 && (
          <CoupangWrappeer>
            <iframe
              title="coupang"
              src="https://ads-partners.coupang.com/widgets.html?id=783667&template=carousel&trackingCode=AF8712424&subId=&width=680&height=140&tsource="
              width="100%"
              scrolling="no"
              style={{ margin: "0 auto" }}
            />
          </CoupangWrappeer>
        )}
      </Wrapper>

      {randomNumber === 0 && (
        <GoogleAdvertise
          client="ca-pub-9665234618246720"
          slot="2191443590"
          format="auto"
          responsive="true"
        />
      )}
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

const CoupangWrappeer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 40px;
`;
