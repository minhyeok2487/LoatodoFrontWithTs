import { ToastContainer as Container } from "react-toastify";

const ToastContainer = () => {
  return (
    <Container
      position="top-right"
      autoClose={3000}
      closeOnClick
      draggable
      pauseOnFocusLoss={false}
      theme="light"
      limit={1}
      pauseOnHover={false}
      bodyStyle={{ fontSize: "14px", color: "black" }}
      toastStyle={{ marginTop: "50px" }}
    />
  );
};

export default ToastContainer;
