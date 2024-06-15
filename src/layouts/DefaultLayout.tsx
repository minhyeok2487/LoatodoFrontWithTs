import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { FC } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GoogleAdvertise from "@components/GoogleAdvertise";
import Modal from "@components/Modal";
import SignUpCharactersNotify from "@components/SignUpCharactersNotify";

import LoadingBar from "./common/LoadingBar";
import Navbar from "./common/Navbar";
import Wrapper from "./common/Wrapper";

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
  const randomNumber = Math.random() < 0.5 ? 0 : 1;

  return (
    <>
      <LoadingBar />
      <Navbar />

      <Wrapper>
        <SignUpCharactersNotify />
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
        {randomNumber === 1 && (
          <div
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
          </div>
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
      <Modal />
      <SpeedInsights />
      <Analytics />
    </>
  );
};

export default DefaultLayout;
