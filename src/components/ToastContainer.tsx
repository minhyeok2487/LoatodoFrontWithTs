import { useTheme } from "@emotion/react";
import { useAtomValue } from "jotai";
import { ToastContainer as Container } from "react-toastify";

import { themeAtom } from "@core/atoms/theme.atom";

const ToastContainer = () => {
  const theme = useTheme();

  const themeState = useAtomValue(themeAtom);

  return (
    <Container
      position="top-right"
      autoClose={3000}
      closeOnClick
      draggable
      pauseOnFocusLoss={false}
      theme={themeState === "dark" ? "dark" : "light"}
      limit={5}
      pauseOnHover={false}
      bodyStyle={{ fontSize: "14px", color: theme.app.text.black }}
      style={{ marginTop: 50 }}
    />
  );
};

export default ToastContainer;
