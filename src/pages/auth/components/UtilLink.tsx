import type { AnchorHTMLAttributes, FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: string;
  to: string;
}

const UtilLink: FC<Props> = ({ children, to, ...rest }) => {
  return (
    <Wrapper to={to} {...rest}>
      {children}
    </Wrapper>
  );
};

export default UtilLink;

const Wrapper = styled(Link)`
  line-height: 1;
  font-size: 14px;
  font-weight: 700;
  border-bottom: 1px solid ${({ theme }) => theme.app.text.dark1};
`;
