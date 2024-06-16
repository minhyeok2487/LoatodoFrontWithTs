import styled from "@emotion/styled";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { FC } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GoogleAdvertise from "@components/GoogleAdvertise";
import Modal from "@components/Modal";

import Header from "./common/Header";
import LoadingBar from "./common/LoadingBar";
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
        <ToastContainer
          position="top-right"
          autoClose={3000}
          closeOnClick
          pauseOnFocusLoss
          draggable
          theme="light"
          limit={1}
          pauseOnHover={false}
          bodyStyle={{ fontSize: "14px", color: "black" }}
          toastStyle={{ marginTop: "50px" }}
        />
        {children}
      </Wrapper>

      <Modal />
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
