import styled from "@emotion/styled";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { FC } from "react";

import GoogleAdvertise from "@components/GoogleAdvertise";

import Header from "./common/Header";
import LoadingBar from "./common/LoadingBar";
import Toast from "./common/Toast";
import Wrapper from "./common/Wrapper";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <LoadingBar />
      <Header />

      <Wrapper>
        <AdWrapper>
          <GoogleAdvertise
            client="ca-pub-9665234618246720"
            slot="2191443590"
            format="horizontal"
            responsive="false"
          />
        </AdWrapper>
        <Toast />

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
