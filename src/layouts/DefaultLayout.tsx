import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/layouts/DefaultLayout.css";
import { FC, useEffect } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import GoogleAdvertise from "../components/GoogleAdvertise";
import LoadingBarLayout from "./LoadingBarLayout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { themeMode } from "../core/atoms/Theme.atom";
import { useRecoilValue } from "recoil";
import { ThemeEnums } from "../core/enum/ThemeEnum";

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
  const theme: ThemeEnums = useRecoilValue(themeMode);
  const { LIGHT } = ThemeEnums;

  return (
    <>
      <LoadingBarLayout />
      <Navbar />
      <div className="wrap">
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
      <GoogleAdvertise
        client="ca-pub-9665234618246720"
        slot="2736107186"
        format="autorelaxed"
        responsive="true"
      />
      <SpeedInsights />
      <Analytics />
    </>
  );
};

export default DefaultLayout;
