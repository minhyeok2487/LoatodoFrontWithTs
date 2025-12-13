import { useAtomValue } from "jotai";
import type { FC } from "react";
import Ad from "src/module/Ad";

import { authAtom } from "@core/atoms/auth.atom";
import useIsBelowWidth from "@core/hooks/useIsBelowWidth";

import Footer from "@components/Footer";

import Header from "./common/Header";
import Wrapper from "./common/Wrapper";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: FC<Props> = ({ children }) => {
  const isMobile = useIsBelowWidth(900);
  const auth = useAtomValue(authAtom);

  const shouldShowAd = !auth.adsDate || new Date(auth.adsDate) <= new Date();

  return (
    <>
      <Header />
      {isMobile && shouldShowAd && (
        <Ad placementName="mobile_banner" alias="default-mobile-banner" />
      )}

      <Wrapper>{children}</Wrapper>

      <Footer />
    </>
  );
};

export default AuthLayout;
