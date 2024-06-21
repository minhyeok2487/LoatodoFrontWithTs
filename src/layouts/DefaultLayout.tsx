import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/layouts/DefaultLayout.css";
import { FC } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import GoogleAdvertise from "../components/GoogleAdvertise";
import LoadingBarLayout from "./LoadingBarLayout";
import SignUpCharactersNotify from "../components/SignUpCharactersNotify";
import MaintenanceNotice from "./MaintenanceNotice";

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
  const randomNumber = Math.random() < 0.5 ? 0 : 1;
  return (
    <>
      <LoadingBarLayout />
      <Navbar />
      <div className="wrap">
        <SignUpCharactersNotify />
        <MaintenanceNotice />
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
              src="https://ads-partners.coupang.com/widgets.html?id=783667&template=carousel&trackingCode=AF8712424&subId=&width=680&height=140&tsource="
              width="100%"
              scrolling="no"
              style={{ margin: "0 auto" }}
            ></iframe>
          </div>
        )}
      </div>
      <Modal />
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
