import type { FC } from "react";

import Footer from "@components/Footer";

import Header from "./common/Header";
import Wrapper from "./common/Wrapper";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />

      <Wrapper>{children}</Wrapper>

      <Footer />
    </>
  );
};

export default AuthLayout;
