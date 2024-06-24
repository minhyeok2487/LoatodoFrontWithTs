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
  margin: 60px auto 0;
  padding: 20px 0;
  width: 100%;
  max-width: 1280px;
  height: 100%;
  color: ${({ theme }) => theme.app.text.dark1};

  ${({ theme }) => theme.medias.max1280} {
    padding: 20px 16px;
  }
`;
