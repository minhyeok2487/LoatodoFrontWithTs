import type { FC } from "react";
import Ad from "src/module/Ad";

import useIsBelowWidth from "@core/hooks/useIsBelowWidth";

import Footer from "@components/Footer";

import Header from "./common/Header";
import Wrapper from "./common/Wrapper";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: FC<Props> = ({ children }) => {
  const isMobile = useIsBelowWidth(900);

  return (
    <>
      <Header />
      {isMobile && (
        <Ad placementName="mobile_banner" alias="default-mobile-banner" />
      )}

      <Wrapper>{children}</Wrapper>

      <Footer />
    </>
  );
};

export default AuthLayout;
