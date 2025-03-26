import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import type { FC } from "react";
import styled from "styled-components";

import GoogleAdvertise from "@components/GoogleAdvertise";

import CherryBlossom from "./CherryBlossom";
import Header from "./common/Header";
import Wrapper from "./common/Wrapper";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />

      <Wrapper>
        <CherryBlossom />
        <AdWrapper>
          <GoogleAdvertise
            client="ca-pub-9665234618246720"
            slot="2191443590"
            format="horizontal"
            responsive="false"
          />
        </AdWrapper>
        {/* <EmergencyNotice /> */}

        {children}
      </Wrapper>

      <SpeedInsights />
      <Analytics />
    </>
  );
};

export default AuthLayout;

const AdWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;
