import styled from "@emotion/styled";
import type { FC } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: string;
  to: string;
}

const UtilLink: FC<Props> = ({ children, to }) => {
  return <Wrapper to={to}>{children}</Wrapper>;
};

export default UtilLink;

const Wrapper = styled(Link)`
  line-height: 1;
  font-size: 14px;
  font-weight: 700;
  border-bottom: 1px solid ${({ theme }) => theme.app.text.dark1};
`;
