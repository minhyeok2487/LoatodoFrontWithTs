import styled from "@emotion/styled";
import type { ReactNode } from "react";

import GoldIcon from "@assets/images/ico_gold.png";

interface Props {
  children: ReactNode;
}

const GoldText = ({ children }: Props) => {
  return <Wrapper>{children} G</Wrapper>;
};

export default GoldText;

const Wrapper = styled.span`
  margin-top: 3px;
  padding-left: 16px;
  font-size: 13px;
  line-height: 14px;
  letter-spacing: -0.02em;
  background: url(${GoldIcon}) no-repeat;
  background-position: 0 0;
  background-size: 14px;
`;
