import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/layouts/DefaultLayout.css";
import { FC } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import LoadingBarLayout from "./LoadingBarLayout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import GoogleAdvertise from "../components/GoogleAdvertise";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <LoadingBarLayout />
      <Navbar />
      <div className="wrap">
        <div style={{ width: "100%", marginBottom: 20 }}>
          <GoogleAdvertise
            client="ca-pub-9665234618246720"
            slot="2191443590"
            format="horizontal"
            responsive="false"
          />
        </div>
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
      </div>
      <Modal />
      <SpeedInsights />
      <Analytics />
    </>
  );
};

export default AuthLayout;
