import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../styles/layouts/DefaultLayout.css";
import { FC, useEffect } from "react";
import { TEST_ACCESS_TOKEN } from "../constants";

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  const notify = () => toast("비로그인 상태, 테스트 데이터 입니다.");
  useEffect(() => {
    if (accessToken === TEST_ACCESS_TOKEN) {
      notify();
    }
  }, [accessToken]);
  return (
    <div className="wrap">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeOnClick
        pauseOnFocusLoss
        draggable
        theme="light"
        limit={1}
      />
      {children}
    </div>
  );
};

export default DefaultLayout;
