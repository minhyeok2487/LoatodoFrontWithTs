import { ToastContainer } from "react-toastify";

const Toast = () => {
  return (
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
  );
};

export default Toast;
