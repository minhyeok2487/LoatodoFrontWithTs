import styled from "@emotion/styled";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const BoxTitle = ({ children }: Props) => {
  return <Title>{children}</Title>;
};

export default BoxTitle;

const Title = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.black};
`;
