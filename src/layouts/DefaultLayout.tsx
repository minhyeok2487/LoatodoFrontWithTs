import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/layouts/DefaultLayout.css";
import { FC, useEffect } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { useMember } from "../core/apis/Member.api";

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="wrap">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          closeOnClick
          pauseOnFocusLoss
          draggable
          theme="light"
          limit={1}
          pauseOnHover={false}
          bodyStyle={{ fontSize: "16px", color: "black" }}
          toastStyle={{ marginTop: "50px" }}
        />
        {children}
      </div>
      <Modal />
    </>
  );
};

export default DefaultLayout;
