import styled from "@emotion/styled";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Wrapper = ({ children }: Props) => {
  return <StyledWrapper>{children}</StyledWrapper>;
};

export default Wrapper;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  padding: 50px 0 20px;
  color: ${({ theme }) => theme.app.text.dark1};
  height: 100%;
`;
