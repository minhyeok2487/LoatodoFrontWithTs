import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/layouts/DefaultLayout.css";
import { FC, useEffect } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import GoogleAdvertise from "../components/GoogleAdvertise";
import LoadingBarLayout from "./LoadingBarLayout";

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <LoadingBarLayout />
      <Navbar />
      <div className="wrap">
        <div style={{width:"100%"}}>
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
      <GoogleAdvertise
        client="ca-pub-9665234618246720"
        slot="2736107186"
        format="autorelaxed"
        responsive="true"
      />
    </>
  );
};

export default DefaultLayout;
