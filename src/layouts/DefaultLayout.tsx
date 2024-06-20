import styled from "@emotion/styled";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useState } from "react";
import type { FC } from "react";
import "react-toastify/dist/ReactToastify.css";

import GoogleAdvertise from "@components/GoogleAdvertise";
import SignUpCharactersNotify from "@components/SignUpCharactersNotify";

import Header from "./common/Header";
import LoadingBar from "./common/LoadingBar";
import Toast from "./common/Toast";
import Wrapper from "./common/Wrapper";

interface Props {
  pageTitle?: string;
  children: React.ReactNode;
}

const DefaultLayout: FC<Props> = ({ pageTitle, children }) => {
  const [randomNumber] = useState(Math.random() < 0.5 ? 0 : 1);

  return (
    <>
      <LoadingBar />
      <Header />

      <Wrapper>
        {pageTitle && <Title>{pageTitle}</Title>}

        <SignUpCharactersNotify />
        <Toast />

        {children}

        {randomNumber === 1 && (
          <CoupangWrappeer
            style={{
              maxWidth: "1280px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
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
          slot="2736107186"
          format="autorelaxed"
          responsive="true"
        />
      )}

      <SpeedInsights />
      <Analytics />
    </>
  );
};

export default DefaultLayout;

const Title = styled.h2`
  margin-bottom: 16px;
  width: 100%;
  font-size: 22px;
  font-weight: 700;
  text-align: left;
  color: ${({ theme }) => theme.app.text.main};
`;

const CoupangWrappeer = styled.div`
  width: 100%;
  margin-top: 40px;
`;
